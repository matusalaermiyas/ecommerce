const DataUriParser = require('datauri/parser');
const parser = new DataUriParser();


const defaultProfile = require('./defaultProfile');

const getMimeType = (mime) => {
    const index = mime.indexOf('/');

    return '.' + mime.substring(index + 1)
}

const getImage = async (image) => {
    if(image) {
      const profile = await parser.format(getMimeType(image.mimetype), image.data);

      return profile.content
    } 

    return defaultProfile;

}


module.exports = getImage;