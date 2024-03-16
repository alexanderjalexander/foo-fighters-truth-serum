import { Router } from "express";
import session from "express-session";
import { getPersonByName, getPersonById } from "../data/people.js";
import { getUserById } from "../data/users.js";
import { getDetection } from "../data/detections.js";
import { ObjectId } from "mongodb";

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

router.get("/:personId", async (req, res) => {
    if (!req.session) {
      res.status(401).json({ error: "No active session detected" });
      return;
    }
    
    const personId = req.params.personId;
    if (!personId) {
      res.status(400).json({ error: "person id not provided" });
      return;
    }
    // console.log(req.session.userId);
    // console.log(req.params.personId)
    const person = await getPersonById(req.session.userId, personId);
    //gets user does not exist thrown when i switch ids, which indicates that it is checking the user id properly
    console.log(person);
    if (!person) {
      res.status(404).json({ message: "Person not found" });
      return;
    }
    const detectionObjIDs = person.detections;
    const detectionArr = await Promise.all(detectionObjIDs.map(detectionID => getDetection(detectionID)));
    detectionArr.forEach((detection) => {
      if (!detection) {
        res.status(500);
        return;
      }
    });
    detectionArr.forEach((detection) => {
      delete detection._id;
    });
    res.status(200).json(detectionArr);
});

export default router;