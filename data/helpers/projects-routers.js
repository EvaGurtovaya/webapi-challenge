const express = require("express");

const Projects = require("./projectModel.js");
const Actions = require("./actionModel.js");

const router = express.Router();

module.exports = router;

router.post("/", async (req, res) => {
    const newProject = req.body;

    if (newProject.name && newProject.description) {
        try {
            const post = await Projects.insert(req.body);
            res.status(201).json(post);
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message:
                    "There was an error while saving the project to the database"
            });
        }
    } else {
        res.status(400).json({
            err: "Please provide name and description for the project."
        });
    }
});

router.post("/:id/actions", async (req, res) => {
    const actionsData = { ...req.body, project_id: req.params.id };

    if (actionsData.notes && actionsData.description) {
        try {
            const post = await Actions.insert(actionsData);
            res.status(201).json(post);
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message:
                    "There was an error while saving the action to the database"
            });
        }
    } else {
        res.status(400).json({
            err: "Please provide notes and description for the project."
        });
    }
});

router.get("/", async (req, res) => {
    try {
        const projects = await Projects.get();
        res.status(200).json(projects);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "The projets information could not be retrieved."
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const project = await Projects.getById(req.params.id);

        if (project) {
            res.status(200).json(project);
        } else {
            res.status(404).json({
                message: "The project with the specified ID does not exist"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "The project information could not be retrieved"
        });
    }
});

router.get("/:id/actions", async (req, res) => {
    try {
        const actions = await Projects.getProjectActions(req.params.id);

        if (actions.length) {
            res.json(actions);
        } else {
            res.status(404).json({
                err: "The project with the specified ID does not exist."
            });
        }
    } catch (err) {
        res.status(500).json({
            err: "The actions information could not be retrieved."
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const project = await Projects.remove(req.params.id);

        if (project) {
            res.status(200).json(project);
        } else {
            res.status(404).json({
                message: "The project with the specified ID does not exist."
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "The project could not be removed."
        });
    }
});

router.put("/:id", async (req, res) => {
    const updatedProject = req.body;

    if (updatedProject.name && updatedProject.description) {
        try {
            const project = await Projects.update(req.params.id, req.body);
            res.status(200).json(project);
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "The projects information could not be modified."
            });
        }
    } else {
        res.status(400).json({
            err: "Please provide name and description for the project."
        });
    }
});

router.delete("/:project_id/actions/:id", async (req, res) => {
    try {
        const project = await Projects.getById(req.params.project_id);
        if (
            project != null &&
            project.actions.filter(action => action.id == req.params.id)
                .length > 0
        ) {
            const actions = await Actions.remove(req.params.id);
            if (actions) {
                res.status(200).json(actions);
            } else {
                res.status(404).json({
                    message: "The action with the specified ID does not exist."
                });
            }
        } else {
            res.status(404).json({
                message:
                    "The project or action with the specified ID does not exist."
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "The action could not be removed."
        });
    }
});

router.put("/:project_id/actions/:id", async (req, res) => {
    const updatedAction = req.body;

    if (updatedAction.notes && updatedAction.description) {
        try {
            const actions = await Actions.update(req.params.id, req.body);
            res.status(200).json(actions);
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "The action information could not be modified."
            });
        }
    } else {
        res.status(400).json({
            err: "Please provide notes and description for the project."
        });
    }
});
