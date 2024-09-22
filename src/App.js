import React, { useState, useEffect } from "react";
import sampleData from "./data/sampleData.json";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  Box,
  Fade,
} from "@mui/material";
import {
  Create as CreateIcon,
  Message as MessageIcon,
  Send as SendIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from "@mui/icons-material";

// Create a custom theme
const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#9c27b0", // Purple color
      },
      background: {
        default: mode === "light" ? "#f8f7fc" : "#121212",
        paper: mode === "light" ? "#ffffff" : "#1e1e1e",
      },
    },
    typography: {
      fontFamily: "Ubuntu, Open Sans, sans-serif",
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 20,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          },
        },
      },
    },
  });

const drawerWidth = 240;

const exampleQuestions = [
  {
    id: 1,
    question: "Hi, what is the weather",
    description: "Get immediate AI generated response",
  },
  {
    id: 2,
    question: "Hi, what is my location",
    description: "Get immediate AI generated response",
  },
  {
    id: 3,
    question: "Hi, what is the temperature",
    description: "Get immediate AI generated response",
  },
  {
    id: 4,
    question: "Hi, how are you",
    description: "Get immediate AI generated response",
  },
];

const dummyConversation = [
  { id: 1, role: "user", content: "Hi!", timestamp: "10:33 AM" },
  {
    id: 2,
    role: "bot",
    content: "Hi There. How can I assist you today?",
    timestamp: "10:33 AM",
  },
  { id: 3, role: "user", content: "How are you today?", timestamp: "10:34 AM" },
  {
    id: 4,
    role: "bot",
    content:
      "As an AI Language Model, I don't have feelings, but I'm functioning well and ready to assist you with any questions or tasks you may have. How can I help you today?",
    timestamp: "10:34 AM",
  },
];

function App() {
  const [mode, setMode] = useState("light");
  const theme = React.useMemo(() => getTheme(mode), [mode]);
  const [view, setView] = useState("landing");
  const [messages, setMessages] = useState(dummyConversation);
  const [input, setInput] = useState("");
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [currentFeedbackId, setCurrentFeedbackId] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedback, setFeedback] = useState({});
  const [pastConversations, setPastConversations] = useState([]);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const newMessage = {
        id: messages.length + 1,
        role: "user",
        content: input,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMessage]);
      setInput("");

      // Simulate bot response based on sample data
      setTimeout(() => {
        // Find a matching question in the sampleData
        const matchingQuestion = sampleData.find((item) =>
          input.toLowerCase().includes(item.question.toLowerCase())
        );

        const botResponse = {
          id: messages.length + 2,
          role: "bot",
          content: matchingQuestion
            ? matchingQuestion.response
            : "I'm sorry, I don't understand that.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prevMessages) => [...prevMessages, botResponse]);
      }, 1000);
    }
  };

  const handleFeedback = (id, isPositive) => {
    setCurrentFeedbackId(id);
    if (!isPositive) {
      setFeedbackModalOpen(true);
    } else {
      setFeedback((prev) => ({
        ...prev,
        [id]: { type: "positive", rating: 5 },
      }));
    }
  };

  const handleSendFromLanding = (e) => {
    e.preventDefault();

    if (input.trim()) {
      const newMessage = {
        id: 1,
        role: "user",
        content: input,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages([newMessage]);
      setView("chat");
      setInput("");

      setTimeout(() => {
        const matchingQuestion = sampleData.find((item) =>
          input.toLowerCase().includes(item.question.toLowerCase())
        );

        const botResponse = {
          id: 2, // Next message id
          role: "bot",
          content: matchingQuestion
            ? matchingQuestion.response
            : "I'm sorry, I don't understand that.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        // Add bot response to the new conversation
        setMessages((prevMessages) => [...prevMessages, botResponse]);
      }, 1000);
    }
  };

  const submitFeedback = () => {
    setFeedback((prev) => ({
      ...prev,
      [currentFeedbackId]: { type: "negative", text: feedbackText },
    }));
    setFeedbackModalOpen(false);
    setFeedbackText("");
  };

  const saveConversation = () => {
    setRatingModalOpen(true);
  };

  const submitRatingAndSave = () => {
    const newConversation = {
      id: pastConversations.length + 1,
      messages: messages,
      feedback: feedback,
      overallRating: currentRating,
    };
    setPastConversations([...pastConversations, newConversation]);
    setView("landing");
    setMessages(dummyConversation);
    setFeedback({});
    setCurrentRating(0);
    setRatingModalOpen(false);
  };

  const renderFeedback = (messageId) => {
    const messageFeedback = feedback[messageId];
    if (!messageFeedback) return null;

    return (
      <Box mt={1} fontSize="0.8rem">
        {messageFeedback.type === "positive" ? (
          <Rating value={messageFeedback.rating} readOnly size="small" />
        ) : (
          <Typography variant="body2" color="textSecondary">
            Feedback: {messageFeedback.text}
          </Typography>
        )}
      </Box>
    );
  };

  const renderLanding = () => (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        How Can I Help You Today?
      </Typography>
      <Box display="flex" justifyContent="center" mb={4}>
        <Avatar sx={{ width: 80, height: 80, bgcolor: "primary.main" }}>
          AI
        </Avatar>
      </Box>
      <Grid container spacing={2}>
        {exampleQuestions.map((q) => (
          <Grid item xs={12} sm={6} key={q.id}>
            <Card
              onClick={() => setView("chat")}
              sx={{ cursor: "pointer", height: "100%" }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {q.question}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {q.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box mt={4}>
        {/* Search bar and Ask button */}
        <form
          style={{ display: "flex", gap: 8 }}
          onSubmit={handleSendFromLanding}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your question here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendFromLanding} // Add onClick handler here
          >
            Ask
          </Button>
        </form>
      </Box>
    </Container>
  );

  const renderChat = () => (
    <Container
      maxWidth="md"
      sx={{
        mt: 4,
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 88px)",
      }}
    >
      <Box flexGrow={1} overflow="auto" mb={2}>
        {messages.map((message) => (
          <Box
            key={message.id}
            display="flex"
            justifyContent={message.role === "user" ? "flex-end" : "flex-start"}
            mb={2}
          >
            <Card
              sx={{
                maxWidth: "70%",
                bgcolor:
                  message.role === "user"
                    ? "primary.light"
                    : "background.paper",
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                    {message.role === "user" ? "U" : "AI"}
                  </Avatar>
                  <Typography variant="body2" color="textSecondary">
                    {message.timestamp}
                  </Typography>
                </Box>
                <Typography variant="body1">{message.content}</Typography>
                {renderFeedback(message.id)}
              </CardContent>
              {message.role === "bot" && (
                <Fade in={true}>
                  <Box display="flex" justifyContent="flex-end" p={1}>
                    <IconButton
                      size="small"
                      onClick={() => handleFeedback(message.id, true)}
                    >
                      <ThumbUpIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleFeedback(message.id, false)}
                    >
                      <ThumbDownIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Fade>
              )}
            </Card>
          </Box>
        ))}
      </Box>
      <Box>
        <form onSubmit={handleSend} style={{ display: "flex", gap: 8 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
          >
            Send
          </Button>
        </form>
        <Button
          onClick={saveConversation}
          variant="outlined"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          End Conversation
        </Button>
      </Box>
    </Container>
  );

  const renderPastConversations = () => (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Conversation History
      </Typography>
      <Typography variant="h6" gutterBottom>
        Today's Chats
      </Typography>
      {pastConversations.map((conversation) => (
        <Card
          key={conversation.id}
          sx={{ mb: 2, cursor: "pointer" }}
          onClick={() => {
            setMessages(conversation.messages);
            setFeedback(conversation.feedback);
            setView("chat");
          }}
        >
          <CardContent>
            <Typography variant="h6">Conversation {conversation.id}</Typography>
            <Typography variant="body2" color="textSecondary">
              {conversation.messages[0].content}
            </Typography>
            <Box mt={1}>
              <Typography variant="body2">Overall Rating:</Typography>
              <Rating
                value={conversation.overallRating}
                readOnly
                size="small"
              />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Container>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <Avatar sx={{ mr: 2 }}>AI</Avatar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
            >
              Bot AI
            </Typography>
            <IconButton
              color="inherit"
              onClick={() => setMode(mode === "light" ? "dark" : "light")}
            >
              {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          <List>
            <ListItem button onClick={() => setView("landing")}>
              <ListItemIcon>
                <CreateIcon />
              </ListItemIcon>
              <ListItemText primary="New Chat" />
            </ListItem>
            <ListItem button onClick={() => setView("pastConversations")}>
              <ListItemIcon>
                <MessageIcon />
              </ListItemIcon>
              <ListItemText primary="Past Conversations" />
            </ListItem>
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          {view === "landing" && renderLanding()}
          {view === "chat" && renderChat()}
          {view === "pastConversations" && renderPastConversations()}
        </Box>
      </Box>

      <Dialog
        open={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
      >
        <DialogTitle>Provide Additional Feedback</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Feedback"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackModalOpen(false)}>Cancel</Button>
          <Button onClick={submitFeedback} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={ratingModalOpen} onClose={() => setRatingModalOpen(false)}>
        <DialogTitle>Rate this conversation</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="body1" gutterBottom>
              How would you rate your experience?
            </Typography>
            <Rating
              name="simple-controlled"
              value={currentRating}
              onChange={(event, newValue) => {
                setCurrentRating(newValue);
              }}
              size="large"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRatingModalOpen(false)}>Cancel</Button>
          <Button onClick={submitRatingAndSave} color="primary">
            Submit & Save
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default App;
