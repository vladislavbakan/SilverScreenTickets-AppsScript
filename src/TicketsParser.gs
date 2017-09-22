function getName(text) {
  var priceStartIndex = indexOf(text, "\n", 1, indexOf(text, "Дата:"));
  var priceStopIndex = indexOf(text, " ", 0 , priceStartIndex); 
  if (priceStartIndex < 0 || priceStopIndex < 0) {
  	return "";
  }
  
  var price = text.substring(priceStartIndex + 1, priceStopIndex);  
  var extraLine = price[2] == '.' && price[5] == '.' ? 1 : 0;

  var startIndex = indexOf(text, "\n", extraLine, priceStartIndex);
  var stopIndex = indexOf(text, "\n", 0, startIndex);
  
  if (startIndex >= 0 && stopIndex >= 0) {
  	return text.substring(startIndex + 1, stopIndex);
  } else {
  	return "";
  }
}

function getDate(text) {
  var index = indexOf(text, "Место: ");
  
  if (index >= 0) {
    return new Date(new Date().getFullYear() + "/" + text.substring(index + 10, index + 12) + "/" + text.substring(index + 7, index + 9) + " " + text.substring(index + 13, index + 18));
  } else {
  	return "";
  }
}

function getAddress(text) {
  var index = indexOf(text, ",", 2);
  
  if (index >= 0) {
  	return text.substring(0, index);
  } else {
  	return "";
  }
}

function indexOf(string, searchElement, skipCount, offset) {
  skipCount = skipCount || 0;
  offset = offset || 0;
  var index = -1;

  for (i = 0; i <= skipCount; ++i) {
    index = string.indexOf(searchElement, offset + 1);
    if (index < 0) {
      return index;
    }
    offset = index;
  }

  return index;
}