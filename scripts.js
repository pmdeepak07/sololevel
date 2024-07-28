let currentQuestId = null;
let currentQuestType = null;
let level = 1;
let pointsToNextLevel = 40;

function askName() {
    const name = prompt("Enter your name:");
    if (name) {
        document.getElementById('name').textContent = name;
        localStorage.setItem('userName', name);
    }
}

window.onload = function() {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
        document.getElementById('name').textContent = storedName;
    } else {
        askName();
    }
};

function completeQuest(questId, questType) {
    currentQuestId = questId;
    currentQuestType = questType;
    const button = document.querySelector(`#${questId} button`);
    animateButton(button);
    openModal();
}

function updateMainScreen(message) {
    const mainScreen = document.createElement('div');
    mainScreen.textContent = `${message} completed!`;
    mainScreen.style.position = 'fixed';
    mainScreen.style.top = '10px';
    mainScreen.style.left = '50%';
    mainScreen.style.transform = 'translateX(-50%)';
    mainScreen.style.backgroundColor = '#4b5b6b';
    mainScreen.style.color = '#ffffff';
    mainScreen.style.padding = '10px';
    mainScreen.style.borderRadius = '5px';
    mainScreen.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    document.body.appendChild(mainScreen);

    setTimeout(() => {
        mainScreen.remove();
    }, 3000);
}

function addDailyTask() {
    const newDailyTaskInput = document.getElementById('new-daily-task-input');
    const newDailyTaskText = newDailyTaskInput.value.trim();
    if (newDailyTaskText === '') {
        return;
    }

    const dailyTaskList = document.getElementById('daily-task-list');
    const newDailyTaskId = `daily${dailyTaskList.children.length + 1}`;
    const newDailyTaskItem = document.createElement('li');
    newDailyTaskItem.id = newDailyTaskId;

    newDailyTaskItem.innerHTML = `<span>${newDailyTaskText}</span> - <button onclick="completeQuest('${newDailyTaskId}', 'daily')">Complete</button> <button onclick="deleteTask('${newDailyTaskId}', 'daily')">Delete</button>`;
    dailyTaskList.appendChild(newDailyTaskItem);
    newDailyTaskInput.value = '';
}

function addMainQuest() {
    const newMainQuestInput = document.getElementById('new-main-quest-input');
    const newMainQuestText = newMainQuestInput.value.trim();
    if (newMainQuestText === '') {
        return;
    }

    const mainQuestList = document.getElementById('main-quest-list');
    const newMainQuestId = `quest${mainQuestList.children.length + 1}`;
    const newMainQuestItem = document.createElement('li');
    newMainQuestItem.id = newMainQuestId;

    newMainQuestItem.innerHTML = `<span>${newMainQuestText}</span> - <button onclick="completeQuest('${newMainQuestId}', 'main')">Complete</button> <button onclick="deleteTask('${newMainQuestId}', 'main')">Delete</button>`;
    mainQuestList.appendChild(newMainQuestItem);
    newMainQuestInput.value = '';
}

function deleteTask(taskId, taskType) {
    document.getElementById(taskId).remove();
    if (taskType === 'daily') {
        scheduleDailyReset();
    }
}

function openModal() {
    document.getElementById('stat-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('stat-modal').style.display = 'none';
}

function increaseStat(stat) {
    const statElement = document.getElementById(stat);
    statElement.textContent = parseInt(statElement.textContent) + 1;
    closeModal();
    checkLevelUp();
    if (currentQuestId && currentQuestType) {
        const questElement = document.getElementById(currentQuestId);
        if (questElement) {
            updateMainScreen(questElement.textContent);
            if (currentQuestType === 'daily') {
                questElement.remove();
                scheduleDailyReset();
            } else if (currentQuestType === 'main') {
                questElement.remove();
            }
            currentQuestId = null;
            currentQuestType = null;
        }
    }
}

function checkLevelUp() {
    const stats = ['strength', 'vitality', 'agility', 'intelligence', 'sense'];
    let totalStats = 0;
    stats.forEach(stat => {
        totalStats += parseInt(document.getElementById(stat).textContent);
    });
    if (totalStats >= pointsToNextLevel) {
        levelUp();
    }
}

function levelUp() {
    level++;
    pointsToNextLevel += 10;
    document.getElementById('level').textContent = level;
    const stats = ['strength', 'vitality', 'agility', 'intelligence', 'sense'];
    stats.forEach(stat => {
        document.getElementById(stat).textContent = 1;
    });
    alert("Level Up!");
}

function animateButton(button) {
    button.classList.add('animate');
    setTimeout(() => {
        button.classList.remove('animate');
    }, 500);
}

function resetDailyTasks() {
    const dailyTaskList = document.getElementById('daily-task-list');
    const tasks = dailyTaskList.children;
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const button = task.querySelector('button');
        if (button.textContent === 'Complete') {
            button.textContent = 'Complete';
        }
    }
}

function scheduleDailyReset() {
    const now = new Date();
    const nextReset = new Date();
    nextReset.setHours(24, 0, 0, 0); // Set to midnight of the next day
    const timeUntilReset = nextReset - now;

    setTimeout(() => {
        resetDailyTasks();
        setInterval(resetDailyTasks, 24 * 60 * 60 * 1000); // Reset every 24 hours
    }, timeUntilReset);
}

// Schedule the daily task reset when the script loads
scheduleDailyReset();
