/**
 * Convert pdf file (blob) to a text file on Drive, using built-in OCR.
 * By default, the text file will be placed in the root folder, with the same
 * name as source pdf (but extension 'txt'). Options:
 *   keepPdf (boolean, default false)     Keep a copy of the original PDF file.
 *   keepGdoc (boolean, default false)    Keep a copy of the OCR Google Doc file.
 *   keepTextfile (boolean, default true) Keep a copy of the text file.
 *   path (string, default blank)         Folder path to store file(s) in.
 *   ocrLanguage (ISO 639-1 code)         Default 'en'.
 *
 * @param {blob}   pdfFile    Blob containing pdf file
 * @param {object} options    (Optional) Object specifying handling details
 *
 * @returns {object}          
 *   text                     plain text
 *   pdfFile                  original PDF file if keepPdf is true
 *   textFile                 text file if keepTextfile is true
 */
function pdfToText ( pdfFile, options ) {
  var result = {};
  
  // Ensure Advanced Drive Service is enabled
  try {
    Drive.Files.list();
  }
  catch (e) {
    throw new Error( "To use pdfToText(), first enable 'Drive API' in Resources > Advanced Google Services." );
  }
  
  // Set default options
  options = options || {};
  options.keepTextfile = options.hasOwnProperty("keepTextfile") ? options.keepTextfile : true;
  
  // Prepare resource object for file creation
  var parents = [];
  if (options.path) {
    parents.push({"id": getDriveFolderFromPath(options.path).getId()});
  }
  var pdfName = pdfFile.getName();
  var resource = {
    title: pdfName,
    mimeType: pdfFile.getContentType(),
    parents: parents
  };
  
  // Save PDF to Drive, if requested
  if (options.keepPdf) {
    var file = Drive.Files.insert(resource, pdfFile);
    result.pdfFile = file;
  }
  
  // Save PDF as GDOC
  resource.title = pdfName.replace(/pdf$/, 'gdoc');
  var insertOpts = {
    ocr: true,
    ocrLanguage: options.ocrLanguage || 'en'
  }
  var gdocFile = Drive.Files.insert(resource, pdfFile, insertOpts);
  
  // Get text from GDOC  
  var gdocDoc = DocumentApp.openById(gdocFile.id);
  var text = gdocDoc.getBody().getText();
  
  result.text = text;
  
  // We're done using the Gdoc. Unless requested to keepGdoc, delete it.
  if (!options.keepGdoc) {
    Drive.Files.remove(gdocFile.id);
  }
  
  // Save text file, if requested
  if (options.keepTextfile) {
    resource.title = pdfName.replace(/pdf$/, 'txt');
    resource.mimeType = MimeType.PLAIN_TEXT;

    var textBlob = Utilities.newBlob(text, MimeType.PLAIN_TEXT, resource.title);
    var textFile = Drive.Files.insert(resource, textBlob);
    
    result.textFile = textFile;
  }
  
  // return result
  return result;
}

function getDriveFolderFromPath (path, parent){
  path = path.trim();
  parent = parent || DriveApp.getRootFolder();
  var index = path.indexOf("/");
  
  if (index > 0) {
    parent = findOrCreateFolder(path.substring(0, index), parent);
    return getDriveFolderFromPath(path.substring(index + 1, path.length), parent);
  } else if (index == 0 || path == ""){
    return parent;
  } else {
    return findOrCreateFolder(path, parent);
  }
}

function findOrCreateFolder(name, parent) {
  if (!parent.getFoldersByName(name).hasNext()) {
    parent.createFolder(name);
  }
  
  return parent.getFoldersByName(name).next();
}