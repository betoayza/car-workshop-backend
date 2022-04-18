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

router.post("/cars/addCar", async (req, res) => {
  try {
    const obj = req.body;
    const result = CarModel.save(obj); //La coleccion ya está incluida en la definicion del modelo Car
    result.json();
  } catch (error) {
    console.log("El error es: ", error);
  }
});

export default router;
