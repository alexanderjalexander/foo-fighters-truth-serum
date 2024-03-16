import { Router } from "express";
import session from "express-session";
import { getUserById } from "../data/users.js";

const router = Router()

/* 
expect json with the format of:
{
    "peopleRes": [
        {
            "name": "Richard",
            "numDetections": 2
        },
        {
            "name": "Ronald",
            "numDetections": 1
        },
        {
            "name": "Kevin",
            "numDetections": 0
        }
    ]
}
*/

router.get("/", async (req, res) => {
  if(!req.session.userId){
    res.status(401).json({ error: "No active session detected" });
  } else {
      await getUserById(req.session.userId)
      .then((user) => {
        if(user == null){
          res.status(404).json({ error: "User does not exist." });
          return;
        }
        const people = user.people;
        let peopleRes = [];
        people.forEach((person) => { //omitting detections.
          peopleRes.push({id: person._id, name: person.name, numDetections: person.detections.length});
        });
        res.status(200).json({ peopleRes });
      })
  }
});

export default router;