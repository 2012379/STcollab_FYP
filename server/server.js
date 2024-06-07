const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth_routes");
const userRoutes = require("./controller/user_controller");
const FilesRoutes = require('./routes/files_routes');
const path = require("path");
const multer = require("multer");
const fs = require("node:fs/promises");
const User = require("./models/user_model");
const File = require("./models/file_model");
const Query = require("./models/query_model");
const Gig = require("./models/gig_model");
const { Readable } = require('stream');
const nodemailer = require('nodemailer');
const Room = require("./models/room_model");
const Task = require("./models/task_model");
const dailyGoals = require("./models/dailyGoals_model");
const ToDoList = require("./models/ToDoList_model");
const Notes = require("./models/notes_model");
const roomFile = require("./models/roomFiles_model");
const Message = require("./models/messages_model");

const app = express();
const PORT = 3000;

mongoose
  .connect("mongodb://127.0.0.1:27017/STcollab", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB Connection Error:", error);
  });

  const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      // Determine upload folder based on page or any other condition
      let uploadFolder = "";
      if (req.url === "/api/upload_room_files") {
        uploadFolder = path.resolve(__dirname, "../Public/uploads/room_files");
      } else {
        uploadFolder = path.resolve(__dirname, "../Public/uploads");
      }
      cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
      file.uploadname = file.originalname;
      cb(null, file.uploadname);
    },
  });

const upload = multer({ storage: fileStorageEngine });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", express.static(path.join(__dirname, "../Public/")));
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/files", FilesRoutes);

// Single File Route Handler for file upload
app.post("/api/upload/single", upload.single("file"), async (req, res) => {
  res.send("Single file upload success");
  console.log(req.body);
  
  try {
    const uploaderUsername = req.body.username || "Unknown User";
    const user = await User.findOne({ username: uploaderUsername });

    await File.create({
      originalFileName: req.file.originalname,
      uploaderUsername: uploaderUsername,
      uploaderUserId: user ? user._id : null,
      createdAt: new Date(),
      field: req.body.CS
        ? "Computer Science"
        : req.body.Buss
        ? "Business"
        : "Unknown",
      category: req.body.Sol
        ? "Solution"
        : req.body.RP
        ? "Research"
        : "Unknown",
      filePath: "/Public/uploads/" + req.file.uploadname,
      createdAt: new Date(),
    });  
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/files/:fileId", async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    const filePath = path.join(__dirname, "../", file.filePath);
    const fileData = await fs.readFile(filePath);
    const fileStream = Readable.from(fileData);

    // Determine content type based on file extension
    const fileExtension = path.extname(file.filePath).toLowerCase();
    const contentType = getContentType(fileExtension);
    if (!contentType) {
      return res.status(500).json({ error: "Unsupported file type" });
    }

    // Set the appropriate content type
    res.contentType(contentType);

    // Pipe the file stream to the response
    fileStream.pipe(res);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Helper function to get content type based on file extension
function getContentType(fileExtension) {
  switch (fileExtension) {
    case ".pdf":
      return "application/pdf";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".gif":
      return "image/gif";
    case ".zip":
      return "application/zip";
    case ".html":
      return "text/html";
    case ".css":
      return "text/css";
    case ".js":
      return "application/javascript";
    case ".txt":
      return "text/plain";
    // Add more cases as needed
    default:
      return "application/octet-stream"; // Default to binary data
  }
}

// Add route handler for deleting files
app.delete("/api/files/:fileId", async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const file = await File.findByIdAndDelete(fileId);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }
    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/saveQuery", async (req, res) => {
  try {
    // Create a new record in the 'queries' collection for the user's query
    await Query.create({
      username: req.body.username,
      queryText: req.body.query,
      createdAt: new Date(),
    });

    res.status(200).json({ success: true, message: "Query saved successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.get("/api/getQueries", async (req, res) => {
  try {
    // Retrieve all queries from the 'queries' collection
    const queries = await Query.find();

    // Send the queries as JSON response
    res.status(200).json(queries);
  } catch (error) {
    console.error('Error fetching queries:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/getQueryDetails", async (req, res) => {
  try {
    const queryId = req.query.queryId;

    // Retrieve details of the specified query from the 'queries' collection
    const queryDetails = await Query.findById(queryId);

    // Send the query details as JSON response
    res.status(200).json(queryDetails);
  } catch (error) {
    console.error('Error fetching query details:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/postReply", async (req, res) => {
  try {
    const queryId = req.body.queryId;
    const replyText = req.body.replyText;
    console.log(req.body)

    // Update the query with the new reply
    const updatedQuery = await Query.findByIdAndUpdate(
      queryId,
      { $push: { replies: { text: replyText, username: req.body.username ,createdAt: new Date() } } }, 
      { new: true }
    );

    res.status(200).json({ success: true, message: "Reply posted successfully", updatedQuery });
  } catch (error) {
    console.error('Error posting reply:', error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'stcollabfyp@gmail.com',
    pass: 'zvnm llfi nfyq fnth',
  },
});

// REST API for managing gigs
// Create a new gig
app.post("/api/gig/postGig", async (req, res) => {
  try {
    const { gigname, aboutgig, qualification, skills, gigfield, gigtype, username, email } = req.body;

    console.log(req.body)

    const newGig = await Gig.create({
      gigname,
      aboutgig,
      qualification,
      skills,
      gigfield,
      gigtype,
      username,
      email,
    });

    res.status(201).json({ status: true, message: "Gig posted successfully", gig: newGig });
  } catch (error) {
    console.error('Error posting gig:', error);
    res.status(500).json({ status: false, error: "Internal Server Error" });
  }
});

// Get all gigs
app.get("/api/gig/getGigs", async (req, res) => {
  try {
    const gigs = await Gig.find();
    res.status(200).json(gigs);
  } catch (error) {
    console.error('Error fetching gigs:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/gig/applyToGig/:gigId", async (req, res) => {
  try {
    const gigId = req.params.gigId;
    const userData = req.body;

    // Log the userData to inspect its structure
    console.log('userData:', userData);

    // Send an email to notify the user about the application
    const gig = await Gig.findById(gigId);
    const mailOptions = {
      from: 'stcollabfyp@gmail.com',
      to: gig.email,
      subject: 'Gig Application Notification',
      text: `Dear ${gig.username},\n\nYou have received a new application for your gig (${gig.gigname}).\n\nApplicant details:\nName: ${userData.user.full_name}\nEmail: ${userData.user.email}\nAge: ${userData.user.age}\nGender: ${userData.user.gender}\nProfession: ${userData.user.profession}\nQualification: ${userData.user.qualification}\nInstitute: ${userData.user.institute}\nLinkedIn Link: ${userData.user.linkedin}\n About: ${userData.user.about}\nThank you for using our platform.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.status(200).json({ status: true, message: "Application submitted successfully" });
  } catch (error) {
    console.error('Error applying to gig:', error);
    res.status(500).json({ status: false, error: "Internal Server Error" });
  }
});

app.delete("/api/deleteQuery/:queryId", async (req, res) => {
  try {
    const queryId = req.params.queryId;
    const deletedQuery = await Query.findByIdAndDelete(queryId);
    if (!deletedQuery) {
      return res.status(404).json({ error: "Query not found" });
    }
    res.status(200).json({ message: "Query deleted successfully" });
  } catch (error) {
    console.error("Error deleting query:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/createRoom", async (req, res) => {
  try {
    const { roomName } = req.body;

    const roomCode = Math.floor(1000 + Math.random() * 9000);

    const newRoom = await Room.create({ name: roomName, code: roomCode });

    const mailOptions = {
      from: 'stcollabfyp@gmail.com',
      to: req.body.user_email, 
      subject: 'Room Created Successfully',
      text: `Dear ${req.body.user},\n\nYour room "${roomName}" has been created successfully.\nRoom Code: ${roomCode}\n\nThank you for using our platform.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.status(201).json({ status: true, message: "Room created successfully", room: newRoom });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ status: false, error: "Internal Server Error" });
  }
});

app.get("/api/room/:roomCode", async (req, res) => {
  try {
    const roomCode = req.params.roomCode;
    const username = req.query.username; // Get username from query parameters
    
    // Find the room details based on the room code
    const room = await Room.findOne({ code: roomCode });

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    room.users.push(username); 
    await room.save();

    res.status(200).json(room);
  } catch (error) {
    console.error('Error fetching room details:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add this route after the gig routes
// Route handler for assigning tasks
app.post("/api/task/assign", async (req, res) => {
  try {
    const { room_code, task, assignedTo } = req.body;
    
    console.log("Room Code:", room_code);
    console.log("Received task:", task);
    console.log("Assigned to:", assignedTo);

    // Create a new task
    const newTask = await Task.create({
      room_code,
      task,
      assignedTo,
    });

    console.log("Task created:", newTask);

    res.status(201).json({ success: true, message: "Task assigned successfully", task: newTask });
  } catch (error) {
    console.error('Error assigning task:', error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.get("/api/task/allTasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/api/task/turnIn/:taskId", async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const updatedTask = await Task.findByIdAndUpdate(taskId, { status: "completed" }, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error turning in task:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/task/:taskId", async (req, res) => {
  try {
    const taskId = req.params.taskId;

    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/dailyGoals", async (req, res)=> {
  try {  
    const { room_code, goal } = req.body;
  
    console.log("Room Code: ", room_code);
    console.log("Daily Goals:", goal);
  
    const newGoal = await dailyGoals.create({
      room_code,
      goal,
    });
    
    console.log("Goal Added:", newGoal);
  
    res.status(201).json({ success: true, message: "Goal Added Successfully", goal: newGoal });
  } catch (error) {
    console.error('Error Adding Goal', error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.get("/api/goals/allgoals", async (req, res) => {
  try {
    const goals = await dailyGoals.find();
    res.status(200).json(goals);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/api/dailyGoals/turnIn/:goalId", async(req, res) => {
  try {
    const goalId = req.params.goalId;
    const updatedGoal = await dailyGoals.findByIdAndUpdate(goalId, {status: "Completed"}, 
    {new: true});

    if (!updatedGoal) {
      return res.status(404).json({error: "Goal Not Found"});
    }
    res.status(200).json(updatedGoal);
  } catch (error) {
    console.error('Error turning in task:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

app.delete("/api/dailyGoals/:goalId", async (req, res) => {
  try {
    const goalId = req.params.goalId;
    const deletedGoal = await dailyGoals.findByIdAndDelete(goalId);
    if (!deletedGoal) {
      return res.status(404).json({ error: "Goal not found" });
    }
    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (error) {
    console.error("Error deleting goal:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/ToDoList", async (req, res)=> {
  try{
      const {room_code, ToDo} = req.body;

      console.log("Room Code: ", room_code);
      console.log("To Do:", ToDo);

      const newToDo = await ToDoList.create({
          room_code,
          ToDo,
      })

      res.status(201).json({ success: true, message: "Added To List Successfully", ToDo: newToDo});
  } catch (error) {
    console.error('Error Adding To List', error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.get("/api/ToDoList/allToDo", async (req, res) => {
  try {
    const ToDos = await ToDoList.find();
    res.status(200).json(ToDos);
  } catch (error) {
    console.error('Error fetching ToDo:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/api/ToDoList/turnIn/:ToDoId", async (req, res) => {
  try {
    const ToDoId = req.params.ToDoId;
    const updatedToDo = await ToDoList.findByIdAndUpdate(ToDoId, { status: "Completed" }, { new: true });

    if (!updatedToDo) {
      return res.status(404).json({ error: "ToDo Not Found" });
    }
    res.status(200).json(updatedToDo);
  } catch (error) {
    console.error('Error turning in task:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/ToDoList/:ToDoId", async (req, res) => {
  try {
    const ToDoId = req.params.ToDoId;
    const deletedToDo = await ToDoList.findByIdAndDelete(ToDoId);

    if (!deletedToDo) {
      return res.status(404).json({ error: "ToDo not found" });
    }
    res.status(200).json({ message: "ToDo deleted successfully" });
  } catch (error) {
    console.error("Error deleting ToDo:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/notes", async (req, res) => {
  try {
    const { title, description, RoomCode } = req.body;

    const newNote = await Notes.create({
      note: title,
      description: description,
      room_number: RoomCode,
    });

    res.status(201).json({ success: true, message: "Note saved successfully", note: newNote });
  } catch (error) {
    console.error('Error saving note:', error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.get("/api/getnotes", async (req, res) => {
  try{
    const response = await Notes.find();
    res.status(200).json(response);
  }
  catch(error){
    console.error('Error saving note:', error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.delete("/api/notes/:NoteId", async (req, res) => {
    try {
      const NoteId = req.params.NoteId;
      const deleteNote = await Notes.findByIdAndDelete(NoteId);
  
      if (!deleteNote) {
        return res.status(404).json({ error: "Note not found" });
      }
      res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
      console.error("Error deleting Note:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.put("/api/notes/:noteId", async (req, res) => {
    try {
      const noteId = req.params.noteId;
      const { title, description } = req.body;
  
      const updatedNote = await Notes.findByIdAndUpdate(
        noteId,
        { note: title, description: description },
        { new: true }
      );
  
      if (!updatedNote) {
        return res.status(404).json({ error: "Note not found" });
      }
  
      res.status(200).json({ message: "Note updated successfully", note: updatedNote });
    } catch (error) {
      console.error("Error updating note:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.get("/api/notes/:noteId", async (req, res) => {
    try {
      const noteId = req.params.noteId;
      const note = await Notes.findById(noteId);
      if (!note) {
        return res.status(404).json({ error: "Note not found" });
      }
      res.status(200).json(note);
    } catch (error) {
      console.error("Error fetching note:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.post("/api/upload_room_files", upload.single("file"), async (req, res) => {
    try {
        // File upload successful
        const { originalname, path: filePath } = req.file;
        const { room_code, uploader_username } = req.body;

        // Save the filename in MongoDB
        await roomFile.create({
            originalFileName: originalname,
            room_code: room_code,
            Uploader_username: uploader_username, // Corrected variable name
            file_path: filePath, // Corrected field name
        });

        res.status(200).json({ message: "File uploaded successfully" });
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/api/upload_room_files/:fileId", async (req, res) => {
  try {
      const fileId = req.params.fileId;
      // Find the file by its ID in MongoDB
      const file = await roomFile.findById(fileId);

      if (!file) {
          return res.status(404).json({ error: "File not found" });
      }

      // Send the file as a response
      res.sendFile(file.file_path);
  } catch (error) {
      console.error("Error fetching uploaded file:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/get_uploaded_files", async (req, res) => {
  try {
      const files = await roomFile.find({}, "originalFileName file_path"); 

      res.status(200).json(files);
  } catch (error) {
      console.error("Error fetching uploaded files:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

const http = require('http');
const socketIO = require('socket.io');

// Create a new HTTP server
const server = http.createServer(app); // Attach Express app to HTTP server

// Attach the Socket.IO server to the HTTP server
const io = socketIO(server);

// Socket.IO event handling
io.on('connection', (socket) => {
  console.log('A client connected');

  // Listen for sendMessage event from the client
  socket.on('sendMessage', async (data) => {
      console.log('Received message:', data);
      
      // Save the message to the database
      try {
          const newMessage = new Message({
              username: data.username,
              RoomCode: data.RoomCode,
              message: data.message
          });
          await newMessage.save();
          console.log('Message saved to the database:', newMessage);
      } catch (error) {
          console.error('Error saving message:', error);
      }

      // Emit a customEvent back to the client
      io.emit('customEvent', { message: 'Message saved successfully!' });
  });

  app.get('/api/messages/:roomCode', async (req, res) => {
    try {
      const roomCode = req.params.roomCode;
      const messages = await Message.find({ RoomCode: roomCode });
      res.json(messages);
    } catch (error) {
      res.status(500).send('Error fetching messages');
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
      console.log('A client disconnected');
  });
});


server.listen(3000, () => {
  console.log(`Socket.IO server is running on port 3000`);
});