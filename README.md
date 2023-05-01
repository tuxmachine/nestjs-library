# Library demo app

## Requirements

- Borrowing a book costs 5ct/day.
- Users can only borrow a book if they have sufficient funds for the entire duration.
- The borrowing period is set to 1 month.
- Early returns are eligible for refunds.
- Users cannot borrow new books when another book is overdue.
- Returning a book late incurs a 10ct/day penalty.
- Users can have negative credit.
- Users can always return a book, unless the book has already marked as lost.
- Users that don't resolve their debt within 1 year are suspended.
- Users cannot be reactivated.
- When a user is suspended, any outstanding books are marked lost and those books' amount is decreased.
- Books cannot be deleted from the library if a user is borrowing them.
- All financial mutations are logged as a Transaction to support auditing.

## Out of scope

- Authentication is handled via a 3rd party provider.
- Payment is handled at the local library.
- Granular authorization is over-engineering for a small local library
