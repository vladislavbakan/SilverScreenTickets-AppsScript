# SilverScreenTickets-AppsScript

When you buy cinema tickets at http://silverscreen.by service sends these tickets as PDF attachments to your email.
This script:

* Observs your Gmail
* Finds new tickets
* Parses them 
* Creates Google Calendar event

## Instalation

1. Take a look at Apps Script documentation https://developers.google.com/apps-script/overview
2. Open https://script.google.com and create new project
3. Copy all files from `src` directory to your project
4. Save your project to Google Drive
5. Click `Trigers` icon and configure periodic execution for `silverScreenTicketsFromGmailToCalendar` function
6. Have fun from automatization ;)
