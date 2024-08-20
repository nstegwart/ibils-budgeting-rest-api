exports.formatArrayError = (arrayError) => {
  const formattedErrors = {};
  if (Array.isArray(arrayError) && arrayError.length > 0) {
    arrayError.forEach((error) => {
      formattedErrors[error.path] = error.msg;
    });
  }
  return formattedErrors;
};
