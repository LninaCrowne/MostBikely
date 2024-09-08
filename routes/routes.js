const express = require("express");
const router = express.Router();
const db = require("../model/helper");

// FUNCTION TO GET ALL ROUTES
const getAllRoutes = async () => {
  try {
    const results = await db("SELECT * FROM routes;");
    return results.data;
  } catch (err) {
    throw err;
  }
};

// FUNCTION TO VERIFY IF A ROUTE EXISTS
const routeShouldExist = async id => {
  try {
    const result = await db(`SELECT * FROM routes WHERE id = ${id};`);
    return result.data.length > 0;
  } catch (err) {
    throw err;
  }
};

// GET route list
router.get("/", async (req, res) => {
  try {
    const results = await getAllRoutes();
    res.send(results);
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET one route
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db(`SELECT * FROM routes WHERE id = ${id};`);
    if (result.data.length === 0) {
      res.status(404).send({ message: "Route not found" });
    } else {
      res.send(result.data[0]);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// INSERT a new route into the DB
router.post("/", async (req, res) => {
  const { startPoint, endPoint, distance, routeType } = req.body;
  console.log(req.body); // Verifica lo que llega en el servidor
  if (!startPoint || !endPoint || distance === undefined || !routeType) {
    return res.status(400).send({ message: "Please provide all required fields" });
  }

  const duration = (distance / 50).toFixed(2); 
  try {
    await db(
      `INSERT INTO routes (start_point, end_point, distance, duration, route_type) VALUES ('${startPoint}', '${endPoint}', ${distance}, ${duration}, '${routeType}');`
    );
    const results = await getAllRoutes();
    res.send(results);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

// UPDATE a route
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { distance, routeType } = req.body;
  const duration = (distance / 50).toFixed(2); 
  try {
    const routeExists = await routeShouldExist(id);
    if (!routeExists) {
      return res.status(404).send({ message: "Route not found" });
    }
    await db(
      `UPDATE routes SET distance = ${distance}, duration = ${duration}, route_type = '${routeType}' WHERE id = ${id};`
    );
    const results = await getAllRoutes();
    res.send(results);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

// DELETE a route from the DB
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const routeExists = await routeShouldExist(id);
    if (!routeExists) {
      return res.status(404).send({ message: "Route not found" });
    }
    await db(`DELETE FROM routes WHERE id = ${id};`);
    const results = await getAllRoutes();
    res.send(results);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;


// INSERT a new route into the DB
router.post("/", async (req, res) => {
  const { startPoint, endPoint } = req.body;
  console.log(req.body); 
  if (!startPoint || !endPoint) {
    return res.status(400).send({ message: "Please provide both start and end points" });
  }
  try {
    await db(
      `INSERT INTO routes (start_point, end_point) VALUES ('${startPoint}', '${endPoint}');`
    );
    const results = await db("SELECT * FROM routes;");
    res.send(results.data);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});
// DELETE a route from the DB
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const routeExists = await routeShouldExist(id);
    if (!routeExists) {
      return res.status(404).send({ message: "Route not found" });
    }
    await db(`DELETE FROM routes WHERE id = ${id};`);
    const results = await getAllRoutes();
    res.send(results);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
