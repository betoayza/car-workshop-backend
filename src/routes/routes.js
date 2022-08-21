import { Router } from "express";
//import AdminModel from "../models/adminModel.js";
import CarModel from "../models/carModel.js";
import ClientModel from "../models/clientModel.js";
import ServiceModel from "../models/serviceModel.js";

const router = Router();

// router.get("/", (req, res) => {
//   res.send("Server running on port 5000!");
// });

router.get("/favicon.ico", (req, res) => res.status(204));

//Cars with more 3 years old and just 1 service done
router.get("/cars/search/lists/1", async (req, res) => {
  try {
    //find cars with fabrication year < 2019  ( <= 3 years)
    const less4year = await CarModel.find({ year: { $lt: 2019 } });
    if (less4year.length) {
      console.log("Cars with less than 4 years: ", less4year);

      //Cars codes matched
      const codes_array = less4year.map((obj) => obj.code);
      console.log("Cars codes matched:", codes_array);

      //Services with cars codes matched
      const carServices = await ServiceModel.find({
        $and: [
          {
            carCode: { $in: codes_array },
          },
          { status: "Active" },
        ],
      });

      if (carServices.length) {
        console.log("Services matched: ", carServices);

        //Filter car codes
        const carCodes = carServices.map((obj) => obj.carCode);
        console.log("Car codes with services: ", carCodes);

        let oneService = carCodes.map(async (code) => {
          let num = await ServiceModel.count({ carCode: code });
          console.log(num);
          if (num === 1) {
            return code;
          }
        });

        let result_oneService = await Promise.all(oneService);
        console.log(result_oneService);
        console.log("Just 1 service done: ", result_oneService);
        //Final result
        let doc = await CarModel.find({ code: { $in: result_oneService } });
        console.log("Final Result: ", doc);
        res.json(doc);
      } else res.json(null);
    } else res.json(null);
  } catch (error) {
    console.error(error);
  }
});

router.post("/cars/add", async (req, res) => {
  try {
    console.log(req.body);
    const { patent, clientCode } = req.body;
    //validate patent (never matchs)
    let doc = await CarModel.findOne({ patent }).exec();
    if (doc) {
      res.json(null);
    } else {
      //validate client code exists
      doc = await ClientModel.findOne({
        $and: [{ code: clientCode }, { status: "Active" }],
      }).exec();
      if (doc) {
        const newCar = new CarModel(req.body);
        doc = await newCar.save();
        res.json(doc);
      } else {
        res.json(null);
      }
    }
  } catch (error) {
    console.error(error);
  }
});

router.delete("/cars/delete", async (req, res) => {
  try {
    console.log(req.body);
    const { code } = req.body;
    console.log(code);
    let doc = await CarModel.findOne({
      $and: [{ code }, { status: "Active" }],
    }).exec();
    if (doc) {
      doc.status = "Inactive";
      doc = await doc.save();
      res.json(doc);
    } else res.json(null);
  } catch (error) {
    console.error(error);
  }
});

router.get("/cars/search", async (req, res) => {
  try {
    console.log(req.query);
    const { code } = req.query;
    console.log(code);
    let doc = await CarModel.findOne({
      $and: [{ code }, { status: "Active" }],
    }).exec();
    if (doc) {
      console.log(doc);
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
});

router.put("/cars/modify", async (req, res) => {
  try {
    console.log(req.body);
    const { code, patent, brand, model, year } = req.body;
    //validate car exists
    let doc = await CarModel.findOne({
      $and: [{ code }, { status: "Active" }],
    }).exec();

    let count = await CarModel.count({ patent }); //validate patent
    if ((doc && count === 0) || doc.patent === patent) {
      doc.patent = patent;
      doc.brand = brand;
      doc.model = model;
      doc.year = year;
      doc = await doc.save();
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
});

router.get("/cars/all", async (req, res) => {
  try {
    let doc = await CarModel.find({});
    if (doc.length) {
      console.log(doc);
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
});

//SIGNUP & LOGIN FOR ADMINS
// router.post("/signup", async (req, res) => {
//   try {
//     console.log(req.body);
//     const { code, username } = req.body;
//     //validate user
//     let doc = await AdmintModel.findOne({
//       $or: [{ code }, { username }],
//     }).exec();
//     if (doc) {
//       res.json(null);
//     } else {
//       //add admin
//       const newAdmin = new AdminModel(req.body);
//       doc = await newAdmin.save();
//       res.json(doc);
//     }
//   } catch (error) {
//     console.error(error);
//   }
// });

// router.get("/login", async (req, res) => {
//   try {
//     console.log(req.query);
//     const { username, password } = req.query;
//     let doc = await AdminModel.findOne({
//       $and: [{ username }, { password }],
//     }).exec();
//     if (doc) {
//       res.json(doc);
//     } else {
//       res.json(null);
//     }
//   } catch (error) {
//     console.error(error);
//   }
// });

//-----------------CLIENTS
router.post("/clients/add", async (req, res) => {
  try {
    console.log(req.body);
    const { code, id, email } = req.body;
    //validate code, id& email
    let doc = await ClientModel.findOne({
      $or: [{ code }, { id }, { email }],
    }).exec();
    //validate if clients wants rejoin
    let doc2 = await ClientModel.findOne({
      $and: [{ id }, { status: "Inactive" }],
    }).exec();
    if (!doc || doc2) {
      const newClient = new ClientModel(req.body);
      doc = await newClient.save();
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
}); //working

router.put("/clients/re-add", async (req, res) => {
  try {
    console.log(req.body);
    const { code } = req.body;
    let doc = await ClientModel.findOne({
      $and: [{ code }, { status: "Inactive" }],
    }).exec();
    if (doc) {
      let doc2 = await CarModel.find({ clientCode: code });
      if (doc.length) {
        doc2 = doc2.map(async (car) => {
          car.status = "Active";
        });
        await doc2.save();
      }
      doc.status = "Active";
      doc = await doc.save();
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
});

router.delete("/clients/delete", async (req, res) => {
  try {
    console.log(req.body);
    const { code } = req.body;
    let doc = await ClientModel.findOne({
      $and: [{ code }, { status: "Active" }],
    }).exec();

    if (doc) {
      //delete client cars
      let doc2 = await CarModel.find({ clientCode: code });
      if (doc2.length) {
        doc2.forEach(async (car) => {
          car.status = "Inactive";
          await car.save();
        });
      }

      doc.status = "Inactive";
      doc = await doc.save();
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
});

router.get("/clients/search", async (req, res) => {
  try {
    console.log(req.query);
    const { code } = req.query;
    let doc = await ClientModel.findOne({ code }).exec();
    if (doc) {
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
}); //working

router.put("/clients/modify", async (req, res) => {
  console.log(req.body);
  const { code, id, name, surname, email, phone } = req.body;
  let doc = await ClientModel.findOne({ code }).exec();
  console.log(doc);
  if (doc) {
    doc.id = id;
    doc.name = name;
    doc.surname = surname;
    doc.email = email;
    doc.phone = phone;
    doc = await doc.save();
    res.json(doc);
  } else {
    res.json(null);
  }
});

router.get("/clients/all", async (req, res) => {
  try {
    let doc = await ClientModel.find({});
    if (doc.length) {
      console.log(doc);
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
});

//----------------SERVICES------------------
router.post("/services/add", async (req, res) => {
  try {
    console.log(req.body);
    const { code, carCode } = req.body;
    //validate service code
    let doc = await ServiceModel.findOne({ code }).exec();
    //validate car
    let doc2 = await CarModel.findOne({
      $and: [{ code: carCode }, { status: "Active" }],
    }).exec();
    if (!doc && doc2) {
      const newService = new ServiceModel(req.body);
      doc = await newService.save();
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
}); //working

router.delete("/services/delete", async (req, res) => {
  try {
    console.log(req.body);
    const { code } = req.body;
    console.log(code);
    let doc = await ServiceModel.findOne({
      $and: [{ code }, { status: "Active" }],
    }).exec();
    if (doc) {
      console.log(doc);
      doc.status = "Inactive";
      doc = await doc.save();
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
}); //working

router.get("/services/search", async (req, res) => {
  try {
    console.log(req.query);
    const { code } = req.query;
    console.log(code);
    let doc = await ServiceModel.findOne({
      $and: [{ code }, { status: "Active" }],
    }).exec();
    if (doc) {
      console.log(doc);
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
}); //working

router.put("/services/modify", async (req, res) => {
  try {
    console.log(req.body);
    const { code, amount, carCode, work, carKms } = req.body;

    let doc = await ServiceModel.findOne({
      $and: [{ code }, { carCode }],
    }).exec();
    if (doc) {
      console.log(doc);
      doc.amount = amount;
      doc.carCode = carCode;
      doc.work = work;
      doc.carKms = carKms;
      doc = await doc.save();
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
}); //working

router.get("/services/all", async (req, res) => {
  try {
    let doc = await ServiceModel.find({});
    if (doc.length) {
      console.log(doc);
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
}); //working

export default router;
