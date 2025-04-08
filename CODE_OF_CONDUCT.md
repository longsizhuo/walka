//修改测试11
[中文文档](documentations/CODE_OF_CONDUCT_CN.md)
## 🧪 Technical Roadmap

Due to a mouth ulcer, I am currently unable to speak. Here's a written outline of what I would say in our meeting.

### ✅ Completed Work

1. **Homepage**
    - A simple homepage is designed with an AI-powered input box. (See [TODO0](#todo0))
    - When a user submits a query, two actions are triggered:
        1. The input is sent to the backend, where it calls the [Gemini API](https://www.gemini.com/):
            - ✅ Gemini returns an initial JSON-format travel plan → see [TODO1](#todo1)
            - ✅ Once the user confirms the plan, the interface will be beautified → see [TODO2](#todo2), with reference to the [MCP Guide](https://o90p05z3t4.feishu.cn/wiki/Vldsw7DYdiJHe4kmzcJc0wzTnIc)
        2. The user is routed to a secondary page for plan review → see [TODO3](#todo3)

2. **Issue Identified**
    - If one user spams the API, our app could quickly run out of credits or hit limits.
        - Solution: we need to build a [user system – see Backend TODO 1](#backend-todo-1)
        - Once users are authenticated, we can consider [storing their history – see Backend TODO 2](#backend-todo-2)

---

### 📝 TODO0: User Input Validation

1. Ensure user input is not empty.
2. Instruct Gemini to assume the trip starts from today if no date is provided.

---

### 🧠 TODO1: Parse and Display JSON Data

1. Extract place names from the plan.
2. Use the MCP service to fetch coordinates for each place.
3. Use Google Maps API to display locations on the map.
4. (Bonus) Use the place sequence to generate navigation routes.

---

### 🎨 TODO2: UI Enhancements for Initial Plan

1. Render the basic travel plan structure (see `img.png` in `/documentations`).
2. Visually combine the JSON plan with the map (front-end only).

---

### ➶ TODO3: Modify Plan with User Suggestions

1. The user can only make changes based on the left-side generated plan.
2. Display the updated result visually (see `img_1.png`); should call an image generation API.

---

### 🔐 Backend TODO 1: User System

1. Build a simple user login and registration system.
2. Create basic user profile storage.
3. Implement profile retrieval.
4. Implement profile update.
5. Implement user deletion.
    - Step 4.5 (Bonus): Use ORM to handle these operations.

---

### 📒 Backend TODO 2: Chat History

1. Store each user's history of travel requests and generated plans.
2. Utilize `api.chats.create` for reconstructing session context.

