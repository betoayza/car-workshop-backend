import { Router } from "express";
import mongoose from "mongoose";
import CarModel from "../models/carModel.js";
import ClientModel from "../models/clientModel.js";
import ServiceModel from "../models/serviceModel.js";

const router = Router();

// router.get('/', (req, res)=>{
//   res.send({status: 'Server running on 5000 :)'});
// });

//router for  list with all cars with more 3 years old and just 1 service done
router.get("/cars/search/lists/carlist1", async (req, res) => {
  try {
    //find cars with fabrication year < 2019  ( < 4 years)
    const less4year = await CarModel.find({ year: { $lt: 2019 } });
    if (less4year) {
      console.log("Coches menos de 4 años: ", less4year);

      //filter ids de todos los coches encontrados
      const codes_array = less4year.map((obj) => obj.code);
      console.log("Ids de coches encontrados:", codes_array);

      //filtrar los servicios que tienen los id coches coicidentes, en un array nuevo
      const carServices = await ServiceModel.find({
        carCode: { $in: codes_array },
      });

      if (carServices) {
        console.log("Servicios encontrados: ", carServices);

        //Filter car codes
        const carCodes = carServices.map((obj) => obj.carCode);
        console.log(
          "Codes de autos que tienen servicios encontrados: ",
          carCodes
        );

        //---------------Arreglar
        //Filter by only 1 service

        let oneService = carCodes.map(async (code) => {
          let num = await ServiceModel.count({ carCode: code })
          console.log(num);
          if (num === 1) {
            return code;
          };
        });
        let result_oneService=await Promise.all(oneService);
        console.log(result_oneService);
        console.log("Filtrados por un solo servicio hecho: ", result_oneService);

        //Final result
        let doc = await CarModel.find({ code: { $in: result_oneService } });
        console.log("Resultado final: ", doc);
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
    const { patent } = req.body;
    const newCar = new CarModel(req.body);
    //patent cant match
    let doc = await CarModel.findOne({ patent }).exec();
    console.log(doc);
    if (!doc) {
      doc = await newCar.save();
      console.log(doc);
      if (doc) {
        res.json(doc);
      } else {
        res.json(doc);
      }
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
});

router.delete("/cars/delete/:code", async (req, res) => {
  try {
    console.log(req.params.code);
    const code = req.params.code;
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

router.get("/cars/search/:code", async (req, res) => {
  try {
    console.log(req.params.code);
    const code = req.params.code;
    console.log(code);
    let doc = await CarModel.findOne({ code }).exec();
    console.log(doc);
    res.json(doc);
  } catch (error) {
    console.error(error);
  }
});

router.put("/cars/modify/edit", async (req, res) => {
  try {
    console.log(req.body);
    const { code, patent, brand, model, year, owner } = req.body.form;
    const doc = await CarModel.findOne({ code }).exec();
    doc.patent = patent;
    doc.brand = brand;
    doc.model = model;
    doc.year = year;
    doc.owner = owner;
    const doc2 = await doc.save();
    console.log("Data updated!: ", doc2);
    res.json(doc2);
  } catch (error) {
    console.error(error);
  }
});

//Sigup just exists for Admins
// router.post("/signup", async (req, res) => {
//   try {
//     console.log(req.body);
//     const { id, email, username } = req.body;
//     //validate user
//     let doc = await ClientModel.find({
//       $or: [{ id }, { email }, { username }],
//     });
//     if (!doc.length) {
//       //add admin
//       const newUser = new ClientModel(req.body);
//       doc = await newUser.save();
//       console.log("*", doc);
//       res.json(doc);
//     } else {
//       res.json({});
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });
//-----------------CLIENTS
router.post("/clients/add", async (req, res) => {
  try {
    console.log(req.body);
    const { code, id, email } = req.body;
    let doc = await ClientModel.findOne({
      $or: [{ code }, { id }, { email }],
    }).exec();
    console.log(doc);
    if (doc) {
      res.json(null);
    } else {
      const newClient = new ClientModel(req.body);
      doc = await newClient.save();
      res.json(doc);
    }
  } catch (error) {
    console.error(error);
  }
});

router.delete("/clients/delete/:code", async (req, res) => {
  try {
    console.log(req.params.code);
    const code = req.params.code;
    let doc = await ClientModel.findOne({
      $and: [{ code }, { status: "Active" }],
    }).exec();
    console.log(doc);
    if (doc) {
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

router.get("/clients/search/:code", async (req, res) => {
  try {
    console.log(req.params.code);
    const code = req.params.code;
    let doc = await ClientModel.findOne({ code }).exec();
    res.json(doc);
  } catch (error) {
    console.error(error);
  }
});

router.put("/clients/modify", async (req, res) => {
  console.log(req.body.form);
  const { code, id, name, surname, email, phone } = req.body.form;
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

//----------------SERVICES------------------
router.post("/services/add", async (req, res) => {
  try {
    console.log(req.body);
    const { code, carCode } = req.body;
    //validate service code
    let doc = await ServiceModel.findOne({ code }).exec();
    //validate code car
    let doc2 = await CarModel.findOne({ code: carCode }).exec();
    if (doc || !doc2) {
      res.json(null);
    } else {
      const newService = new ServiceModel(req.body);
      doc = await newService.save();
      res.json(doc);
    }
  } catch (error) {
    console.error(error);
  }
});

router.delete("/services/delete/:code", async (req, res) => {
  try {
    console.log(req.params);
    const code = req.params.code;
    console.log(code);
    let doc = await ServiceModel.findOne({
      $and: [{ code }, { status: "Active" }],
    }).exec();
    console.log(doc);
    if (doc) {
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

router.get("/services/search/:code", async (req, res) => {
  try {
    console.log(req.params.code);
    const code = req.params.code;
    console.log(code);
    let doc = await ServiceModel.findOne({ code }).exec();
    console.log(doc);
    res.json(doc);
  } catch (error) {
    console.error(error);
  }
});

router.put("/services/modify", async (req, res) => {
  console.log(req.body);
  const { code, amount, carCode, work, carKms } = req.body;

  let doc = await ServiceModel.findOne({ code }).exec();
  if (doc) {
    doc.amount = amount;
    doc.carCode = carCode;
    doc.work = work;
    doc.carKms = carKms;
    doc = await doc.save();
    res.json(doc);
  } else {
    res.json(null);
  }
});

export default router;
