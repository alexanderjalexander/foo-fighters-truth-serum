import { Router } from "express";
import session from "express-session";
import { getPersonByName } from "../data/people.js";
import { getUserById } from "../data/users.js";
import { getDetection } from "../data/detections.js";

const router = Router()

/* 
expect json with the format of:
{
    "detectionArr": [
        {
            "name": "Session 1",
            "data": "dummy data"
        },
        {
            "name": "Session 2",
            "data": "dummy data 2"
        }
    ]
}

*/

router.get("/", async (req, res) => {
  try {
    if (!req.session) {
      res.status(400).json({ error: "No active session detected" });
      return;
    }
    
    const { personName } = req.body;
    if (!personName) {
      res.status(400).json({ error: "person name not provided" });
      return;
    }

    const person = await getPersonByName(req.session.userId, personName);
    if (!person) {
      res.status(400).json({ message: "Person not found" });
      return;
    }
    //tried structuring this in the .then.catch format but ran into issues with accidentally sneding headers after they are sent to the client
    const detectionObjIDs = person.detections;
    const detectionArr = await Promise.all(detectionObjIDs.map(detectionID => getDetection(detectionID)));
    //checking for nulls. not sure how we'd get to this specific error
    detectionArr.forEach((detection) => {
      if (!detection) {
        res.status(400).json({ message: "Detection not found when looping through getDetection results" });
        return;
      }
    });
    detectionArr.forEach((detection) => {
      delete detection._id;
    });
    
    res.status(200).json({ detectionArr });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


export default router;