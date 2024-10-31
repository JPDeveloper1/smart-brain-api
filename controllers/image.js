import Clarifai from 'clarifai'
import fetch from 'node-fetch'
const MODEL_ID = "face-detection";
const returnClarifaiJSONRequestOptions = (imageUrl) => {
 
  // Your PAT (Personal Access Token) can be found in the Account's Security section
// f4aa95bf34514a49b3015b7d10086066
  // para que la aplicacion funcione sin necesidad de importar la libreria de clarifai y pase desapercibido como nuestra lo unico que debemos hacer es quitar el import clarifai de la libreria
  const PAT = "2c00e4f5014a4148a01bef243856c702";
  // Specify the correct user_id/app_id pairings
  // Since you're making inferences outside your app's scope
  const USER_ID = "jpdeveloper";
  const APP_ID = "face-recognition-app";
  // Change these to whatever model and image URL you want to use
  // const MODEL_ID = 'face-detection';
  const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: IMAGE_URL,
            // "base64": IMAGE_BYTES_STRING
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + PAT,
    },
    body: raw,
  };
  return requestOptions;
};

export const handleApiCall =(req,res) =>{
  fetch(
    "https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs",
    returnClarifaiJSONRequestOptions(req.body.input)
  )
  .then(response=>response.json())
  .then(data =>{
    res.json(data)
  })
  .catch(err=> res.status(400).json('unable to work witch API'))
}


export const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries',1)
    .returning('entries')
    .then(entries =>  {
      res.json(entries[0].entries)
    })
    .catch(err=> res.status(400).json('unable to get entries'))
  }
  export default handleImage;