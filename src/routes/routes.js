import { Router } from "express";
import mongoose from "mongoose";
import CarModel from "../models/carModel.js";
import ClientModel from "../models/clientModel.js";
import ServiceModel from "../models/serviceModel.js";

const router = Router();

//router for  list with all cars with more 3 years old and just 1 service done
router.get("/cars/searchCar/lists/carlist1", async (req, res) => {
  try {
    //filter car fabrication year < 2017  ( =< 4 years)
    const list1 = await CarModel.find({ year: { $lt: 2017 } }); //.exec()
    //.then( res => {
    console.log("Coches menos de 4 años: ", list1);
    //filter ids
    const ids_array = list1.map((obj) => obj._id.toString());
    console.log("Ids de coches encontrados:", ids_array);
    //filtrar los servicios que tienen los id coches filtrados
    const services = await ServiceModel.find({ carID: { $in: ids_array } });
    console.log("Servicios: ", services);
    //obtener ids de los coches de los servicios
    const array_aux = services.map((obj) => obj.carID);
    console.log("IDs de autos resultantes: ", array_aux);
    //Eliminar los duplicados mediante un Set
    const setCarIDs = new Set(array_aux);
    console.log("Resultado aux: ", setCarIDs);
    //re-convvertir el set a array
    const array_cars_founded = [...setCarIDs].map((elem) => {
      const elem2 = mongoose.Types.ObjectId(elem);
      return elem2;
    });
    console.log("Resultado casi final: ", array_cars_founded);
    //resyltado final
    const result = await CarModel.find({ _id: { $in: array_cars_founded } });
    console.log("Resultado final: ", result);
    res.json(result);
  } catch (error) {
    console.log("El error es: ", error);
  }
});

router.post("/cars/add", async (req, res) => {
  try {
    const { code, patent, brand, model, year, owner } = req.body;
    const carData = { code, patent, brand, model, year, owner };
    //console.log(patent);
    const newCar = new CarModel(carData);
    //console.log(newCar);
    const result = await newCar.save(); //La coleccion ya está incluida en la definicion del modelo Car
    console.log(result);
    res.json(result);
  } catch (error) {
    console.log("El error es: ", error);
  }
});

router.delete("/cars/delete", async (req, res) => {
  try {
    console.log(req.body);
    const { code } = req.body;
    const doc = await CarModel.deleteOne({ code });
    console.log(doc);
    res.json(doc);
  } catch (error) {
    console.log("El error es: ", error);
  }
});

router.get("/cars/getCar", async (req, res) => {
  try {
    //console.log(req.query.code);
    const code = req.query.code;
    console.log(code);
    const doc = await CarModel.findOne({ code }).exec();
    console.log(doc);
    res.json(doc);
  } catch (error) {
    console.error(error);
  }
});

router.put("/cars/modify/edit", async (req, res) => {
  try {
    const {code, patent, brand, model, year, owner} = req.body.form;    
    const doc = await CarModel.findOne({code}).exec();
    doc.patent=patent;
    doc.brand=brand;
    doc.model=model;
    doc.year=year;
    doc.owner=owner;
    const doc2=await doc.save();
    console.log("Data updated!: ", doc2);
    res.json(doc2);
  } catch (error) {
    console.error(error);
  }
});

export default router;
