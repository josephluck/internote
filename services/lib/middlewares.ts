export const ensureJSONBody: middy.Middleware<{}> = () => ({
  after: (handler, next) => {
    if (typeof handler.response.body !== "string") {
      handler.response.body = JSON.stringify(handler.response.body);
    }

    return next();
  }
});
