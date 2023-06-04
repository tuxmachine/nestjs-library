import opentelemetry from '@opentelemetry/api';

export const booksBorrowed = opentelemetry.metrics
  .getMeter('nest-app')
  .createHistogram('app.books_borrowed');
