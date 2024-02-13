const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn")


let userMessage;
//Add the API_KEY
let API_KEY = config.OPENAI_API_KEY;

//Use Prompt engineering techniques to assign a role to your GPT and a tone
//Tell it to act as an expert in the field you decided 
let role =" قصة من ألف ليلة وليلة";

const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
	const chatLi = document.createElement("li");
	chatLi.classList.add("chat", className);
	let chatContent = className === "outgoing" ? `<p></p>` : `<p></p>`;
	chatLi.innerHTML = chatContent;
	chatLi.querySelector("p").textContent = message;
	return chatLi;
}


const generateResponse = (incomingChatLi) => {
	const API_URL = "https://api.openai.com/v1/chat/completions";
	const messageElement = incomingChatLi.querySelector("p");

	const requestOptions = {
		method: "POST",
		headers: {
			"content-Type": "application/json",
			Authorization: `Bearer ${API_KEY}`
		},
		body: JSON.stringify({
			model: "gpt-3.5-turbo",
			messages: [{role: "user", content: role}],
			temperature: 0.7,
		})
	}

	fetch(API_URL, requestOptions).then(res => res.json()).then(data =>{
		messageElement.textContent = data.choices[0].message.content;
	
	}).catch((error) => {
		messageElement.classList.add("error");
		console.log(error);
		messageElement.textContent = "Ooops! something went wrong. Please try again.";
	}).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Get the previous incoming message
    const previousIncomingMessage = chatbox.querySelector(".chat.incoming");
    // const previousoutgoingMessage = chatbox.querySelector(".chat.outgoing");

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);

        // Hide the previous incoming message if there is a new incoming message
        if (previousIncomingMessage) {
            previousIncomingMessage.style.visibility = "hidden";
            previousIncomingMessage.style.height = "0px";
			// previousoutgoingMessage.style.visibility = "hidden";
        }

        generateResponse(incomingChatLi);
    }, 600);
}



chatInput.addEventListener("input", () => {
	chatInput.style.height = `${inputInitHeight}px`;
	chatInput.style.height = `${chatInput.scrollHeight}px`;
})


chatInput.addEventListener("keydown", (e) => {
	if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800){
		e.preventDefault();
		handleChat();
	}
})

// sendChatBtn.addEventListener("click", handleChat);
// chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

