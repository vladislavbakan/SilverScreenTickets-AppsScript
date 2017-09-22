var TAG = "SilverScreenTickets";

function silverScreenTicketsFromGmailToCalendar() {
  var threads = GmailApp.search("from:ticket@silverscreen.by label:inbox !label:" + TAG)
  
  for (i = 0; i < threads.length; ++i) {    
    var thread = threads[i];
    var messages = thread.getMessages();   
    for (j = 0; j < messages.length; ++j) {
      exportMessageToCalendar(messages[j]);
    }   
    thread.addLabel(GmailApp.createLabel(TAG))
  }
}

function exportMessageToCalendar(message) {
  var attachments = message.getAttachments();
  for (i = 0; i < attachments.length; ++i) {
    var attachment = attachments[i];
    if (attachment.getName().indexOf("Билеты") >= 0) { 
      exportPdfToCalendar(attachment.getAs(MimeType.PDF));
    }
  }
}

function exportPdfToCalendar(pdf) {
  var ticketsResult = pdfToText(pdf, {keepTextfile: false, keepPdf: true, path: TAG});
  var tickets = ticketsResult.text;
  
  var name = "Кино: " + getName(tickets);
  var date = getDate(tickets);
  var address = getAddress(tickets);
  var ticketsUrl = DriveApp.getFileById(ticketsResult.pdfFile.getId()).getUrl();
  
  var event = CalendarApp.createEvent(name, date, new Date(date.getTime() + 2 * 60 * 60 * 1000));
  event.setLocation(address);
  event.setDescription(ticketsUrl);
  event.addPopupReminder(10);
  event.addPopupReminder(60);
  event.addPopupReminder(2 * 60);
  event.addPopupReminder(5 * 60);
  event.addPopupReminder(24 * 60);
}