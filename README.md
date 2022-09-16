# permittable
View building permit info from the City of Toronto's Open Data Catalogue

[https://permittable.electronicchicken.com](https://permittable.electronicchicken.com/)

## Notes

I was originally hosting this on Azure, but the resource group was costing me nearly $9 CAD per day and I was going to burn through my $200 free trial credit in no time. Currently using Docker on a local machine instead, a Dell Optiplex sitting under my desk.

I'm not crazy about reactstrap for whatever reason, though it's included with the auto-generated dotnet react "weather forecast" example app. I think I'd rather go on using react-bootstrap, but it'd be worth doing a real comparison of the two.

### To do
This application was written as a learning exercise, and the initial goal was to just get it working, which left several things that need to be improved:

- Re-implement server-side CSV import
  - Perform import in the background
  - Use SignalR(?) to push import status to client
  - Translate CSV data to Permit/Address directly instead of client-generated JSON model binding
  - Improve the situation re: null dates, which are probably currently being translated to the dawn of epoch time
- Improve server-side logging
  - There isn't much of it right now, and it's particularly needed for imports
- Add exception-handling to server side
  - There's little to none at the moment
- Improve map display on client side
  - A bit flaky when mousing over typeahead options
  - Would be nice to keep all markers in place and colorize the active one
    - But this was fraught when using react-google-maps for reasons I don't recall at the moment
- Give address/permit display a bit more style
  - ~~Street view of property when in address view? Mmhmm, I like the way you think~~
  - Throw some icons / badges / colour in there somewhere, it's very grey