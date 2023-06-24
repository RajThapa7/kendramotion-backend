const getPublicIdFromURL = (url) => {
  const splitUrl = url.split("/"); // split the url into an array

  // get the publicId from the url (banners/344856823748.jpg)
  const imageId = splitUrl[splitUrl.length - 1];
  const imageFolder = splitUrl[splitUrl.length - 2];
  const publicId = `${imageFolder}/${imageId}`;

  return publicId.split(".")[0];
};

module.exports = { getPublicIdFromURL };
