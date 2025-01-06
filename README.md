# IktaVT StickyVT 0.1 
Bring your Twitch stream to life with vibrant, customizable sticky notes for real-time audience interactions!

---

# 🎥 Demo

https://github.com/user-attachments/assets/2b8481c9-b36f-4186-b068-00599b959e4c

---


### Twitch Integration
- **PubSub Support**: Connect seamlessly with your Twitch account using OAuth Token, Client ID, and User ID.
- **Subscription Tiers**: Display events for Tier 1, Tier 2, and Tier 3 subscriptions.
- **Channel Point Redemptions**: Show sticky notes for specific channel rewards.

###  Sticky Note Customization
- **Drag and Drop**: Move notes anywhere on the screen.
- **Resizable Notes**: Adjust the size dynamically to fit content.
- **Rotatable Usernames**: Add a quirky twist with rotated text.
- **Dynamic Font Sizing**: Fonts adapt to the sticky note's dimensions.

###  Simulated Events


- Test subscription and redemption features before going live.

### 💾 Persistent Settings
- Save your credentials and preferences securely with browser `localStorage`.

---

### Technologies Used
- **HTML, CSS, JavaScript**: Build a responsive and interactive UI.
- **WebSockets**: Enable real-time Twitch PubSub communication.
- **LocalStorage**: Save user data for a seamless experience.

---

#  How to Use
### 1. Download the Files
Clone the repository or download the files directly:
```
git clone https://github.com/YourUsername/IktaVT-Note.git
cd IktaVT-Note
 ```
### 2. Import the Application
- You can use the app in the following ways:
- OBS: Add the Main.html file as a "Browser Source".
- VTube Studio: Import the Main.html file as a Local File Path in the WebItem settings.
### 3. Enter Your Twitch Credentials
- You can enter and edit your Twitch credentials directly within the app. This can be done in:

- A Web Browser: Open Main.html in any modern browser and enter your credentials.
- OBS or VTube Studio: Interact with the imported Main.html file to input or edit credentials.
  
### Credentials to input:
- OAuth Token: Paste your token securely.
- Client ID: Your Twitch app's client ID.
- User ID: Your Twitch account ID.
  
### 4. Enable Events
After entering your credentials, configure the events you want to display:
- Subscription Tiers: Enable Tier 1, Tier 2, or Tier 3 subscriptions.
- Channel Point Redeem: Specify a reward name to trigger sticky notes for redemptions.


  
### 5. Start Streaming
Once configured, your sticky notes will appear for live events during your stream. Enjoy interacting with your audience in real-time!

---

# Heres How to get the oAuth Token , Client_ID and User_ID

### Get Bot oAuth Token at [TwitchTokenGenerator](https://www.twitchtokengenerator.com/):
- Be sure that it has channel:read:subscriptions , channel:read:redemptions , bits:read

### Get User_ID at [Streamweasals](https://www.streamweasels.com/tools/convert-twitch-username-%20to-user-id/)
- At The Bottom you can Convert your Twitch Name into the User_ID

### Get Client_ID at [Twitch Dev Console](https://dev.twitch.tv/console/extensions/)
- Create an Extension and on the Top Right it should say (Client ID)
