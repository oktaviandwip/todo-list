const tambahTugasButton = document.querySelector('.tambah-tugas')
const todoList = document.querySelector('.todo-list')
const tasks = document.querySelector('.tasks')

const taskList = getItem('taskList') || []
const subtaskList = getItem('subtaskList') || []
const checklistState = getItem('checklistState') || []
let byTanggalState = ''
let finishedTasks = getItem('finishedTasks') || []

//Function to GET ITEM
function getItem(name) {
  return JSON.parse(localStorage.getItem(name))
}

//Function to SET ITEM
function setItem(name, object) {
  localStorage.setItem(name, JSON.stringify(object))
}

//RENDER TASK
renderTask()

//DISPLAY TOTAL FINISHED TASKS
displayTotalFinishedTasks()

//TAMBAH TUGAS
tambahTugasButton.addEventListener('click', () => {
  if (tambahTugasButton.innerText === 'Tambah tugas') {
    changeTambahTugasButton()
    displayTugasInput(tambahTugasInput())
  } else {
    changeTambahTugasButton()
    renderTask()
  }
})

//SORT BY TANGGAL
displayByTanggal()

//Function to CHANGE TAMBAH TUGAS BUTTON
function changeTambahTugasButton() {
  if (tambahTugasButton.innerText === 'Tambah tugas') {
    tambahTugasButton.classList.add('tambah-tugas-clicked')
  
    const tambahTugasClicked = document.querySelector('.tambah-tugas-clicked')
    tambahTugasClicked.innerHTML = 
    `
    <img src="assets/Minus.png">
    Cancel
    `
  } else {
    tambahTugasButton.classList.remove('tambah-tugas-clicked')
    tambahTugasButton.innerHTML = 
    `
    <img src="assets/Plus.png">
    Tambah tugas
    `
  }
}

//Function to TAMBAH TUGAS INPUT
function tambahTugasInput(taskId) {
  const div = document.createElement('div')
  div.innerHTML = `
    <div class="task-input-container-${taskId}">
      <div class="task-name">
        <div class="checklist">
          <img src="assets/Checklist.png">
        </div>
        <input class="task-input" placeholder='Masukkan nama tugas'>
      </div>
      <div class="desc-date">
        <div class="desc">
          <img src="assets/Description.png" class="desc-icon">
          <input placeholder='Deskripsi Tugas (Optional)' class="desc-input">
        </div>
        <div class="date">
          <img src="assets/Date - Icon.png" class="date-icon">
          <input type="date" placeholder='Tanggal & Waktu' class="date-input">
          <div class="date-display">Tanggal & Waktu</div>
        </div>
      </div>
    </div>
    `
  return div
}

//Function to DISPLAY TUGAS INPUT
function displayTugasInput(innerHTML) {
  tasks.appendChild(innerHTML)

  //DISPLAY DATE INPUT
  document.querySelector('.date-input').addEventListener('input', () => {
    displayDateInput()
  })
}

//Function to DISPLAY DATE INPUT
function displayDateInput() {
  const dateInput = document.querySelector('.date-input')
  const dateDisplay = document.querySelector('.date-display')

  const date = new Date(dateInput.value)
    const formattedDate = date.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  dateDisplay.innerHTML = formattedDate
} 

//RENDER TASK
todoList.addEventListener('keydown', (event) => {
  if (event.key === 'Alt') {
    addPrimaryTask()
    renderTask()
    changeTambahTugasButton()
  }
})

//Function to GENERATE LIST ID
function generateListId() {
  return Math.random().toString(36).substr(2, 9)
}

//Function to ADD PRIMARY TASK
function addPrimaryTask() {
  const taskNameInput = document.querySelector('.task-input')
  const descInput = document.querySelector('.desc-input')
  const dateInput = document.querySelector('.date-input')
  const listId = generateListId()

  taskList.push({ id: listId,
                  name: taskNameInput.value,
                  desc: descInput.value,
                  date: dateInput.value
                })
  
  setItem('taskList', taskList)
}


//Function to RENDER TASK
function renderTask(action, taskId) {
  let primaryTaskHTML = ''

  taskList.forEach((task) => {
    let { id, name, desc, date } = task

    date = new Date(date)
    today = new Date()

    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      date = 'Hari Ini';
    } else {
      date = date.toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }

    const primaryTask = `
      <div class="primary-task-${id}">
      <div class="task-name-result">
        <div class="checklist-primaryTask-${id}">
        </div>
        <div class="name-date-container">
          <div class="name-date">
            ${name}<span class="task-date">${date}</span>
            <span class="three-points-${id}"></span>
          </div>
          <span class="arrow-down-black-${id}"></span>
        </div>
      </div>
      <div class="desc-result">${desc}</div>
    </div>
    `
    
    if (action === 'rename') {
      if (id === taskId) {
        primaryTaskHTML += tambahTugasInput(taskId).innerHTML
        changeTambahTugasButton()
      } else {
        primaryTaskHTML += primaryTask
      }
    } else {
        primaryTaskHTML += primaryTask
    }
  })
  
  tasks.innerHTML = primaryTaskHTML
 
  //DISPLAY ARROW DOWN BUTTON
  displayArrowDown()

  //THREE POINTS BUTTON
  displayThreePoints()

  //CHECKLIST PRIMARY TASK
  checklistPrimaryTask()
}

//Function to DISPLAY ARROW DOWN
function displayArrowDown() {
  document.querySelectorAll("[class*='arrow-down-black']").forEach((arrowDown) => {
    arrowDown.addEventListener('click', () => {
      let subtasksId = arrowDown.className.split('-')[3]
      arrowDown.classList.toggle('arrow-up-grey')

      if (arrowDown.classList.contains('arrow-up-grey')) {
        const div = document.createElement('div')
        div.className = `subtasks-${subtasksId}`
        div.innerHTML = `
          <div class="header-subtask">
            <div>Subtask</div>
            <button class="tambah-subtask-${subtasksId}">
              <img src="assets/Plus Orange.png">
              <p>Tambah</p>
            </button>
          </div>
          <div class="subtasksContainer-${subtasksId}">
          </div>
          `
        document.querySelector(`.primary-task-${subtasksId}`).appendChild(div)

        //DISPLAY SUBTASKS RESULT
        displaySubtasksResult(subtasksId)

        //TAMBAH SUBTASK INPUT
        tambahSubtaskInput(subtasksId)
      
      } else {
        subtasksId = arrowDown.className.split('-')[3].split()[0]
        document.querySelector(`.subtasks-${subtasksId}`).remove()
      } 
    })
  })
}

//Function to TAMBAH SUBTASK INPUT
function tambahSubtaskInput(subtasksId) {
  document.querySelector(`.tambah-subtask-${subtasksId}`).addEventListener('click', () => {
    const div = document.createElement('div')
    div.className = `subtaskInputContainer`
    div.innerHTML = `
      <div class="checklist">
        <img src="assets/Checklist.png">
      </div>
      <div class="subtask-name">
        <input class="subtask-input" placeholder='Masukkan sub-tugas'>
        <img src="assets/Delete - Icon.png" class="delete-icon">
      </div>
      `
    document.querySelector(`.subtasksContainer-${subtasksId}`).appendChild(div)

    //Add CLASS NUMBER
    document.querySelectorAll(`.subtaskInputContainer`).forEach((subtaskInputContainer, indexSubtaskInput) => {
      subtaskInputContainer.classList.add(`number-${indexSubtaskInput}`)
    })

    //DELETE SUBTASK INPUT
    deleteSubtaskInput(subtasksId)

    //ADD DISPLAY SUBTASKS RESULT
    addSubtasksResult(subtasksId)
  })
}

//Function to DELETE SUBTASK INPUT
function deleteSubtaskInput(subtasksId) {
  document.querySelectorAll(`.subtasksContainer-${subtasksId} .delete-icon`).forEach((deleteIcon, indexDeleteButton) => {
    deleteIcon.addEventListener('click', () => {
      document.querySelector(`.subtaskInputContainer.number-${indexDeleteButton}`).remove()
    })
  })
}

//Function to ADD SUBTASKS
function addSubtasksResult(subtasksId) {
  let subtaskListTemp = []
  document.querySelector(`.subtasks-${subtasksId}`).addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      document.querySelectorAll(`.subtasks-${subtasksId} .subtask-input`).forEach((subtaskInput) => {
        subtaskListTemp.push(subtaskInput.value)
      })

      let index = subtaskList.findIndex(item => item.id === subtasksId)
      if (index === -1) {
        subtaskList.push({
                          id: subtasksId,
                          subtaskNames: subtaskListTemp
                        })
      } else {
        subtaskList[index].subtaskNames = subtaskList[index].subtaskNames.concat(subtaskListTemp) 
      }
      subtaskListTemp = []
      setItem('subtaskList', subtaskList)

      //DISPLAY SUBTASKS RESULT
      displaySubtasksResult(subtasksId)
    }
  })
}

//Function to DISPLAY SUBTASKS RESULT
function displaySubtasksResult(subtasksId) {  
  let subtaskResultHTML = ''
  subtaskList.forEach((subtask) => {
    if (subtask.id === subtasksId) {
      let index = checklistState.findIndex(item => item.id === subtasksId)
      subtask.subtaskNames.forEach((subtaskName, indexSubtaskName) => {
        if (index === -1) {
          subtaskResultHTML += `
            <div class="subtaskResult-${indexSubtaskName}">
              <div class="checklistSubtaskResult">
              </div>
              <div class="subtask-name-result">
                <div class="subtaskName-${indexSubtaskName}">
                  ${subtaskName}
                </div>
                <img src="assets/Delete - Icon.png" class="delete-icon-result">
              </div>
            </div>
            `
        } else {
          if (checklistState[index].checklistNames.includes(subtaskName)) {
            subtaskResultHTML += `
              <div class="subtaskResult-${indexSubtaskName}">
                <div class="checklistSubtaskResult checklistSubtaskResultClicked">
                </div>
                <div class="subtask-name-result">
                  <div class="subtaskName-${indexSubtaskName} subtaskNameClicked">
                    ${subtaskName}
                  </div>
                  <img src="assets/Delete - Icon.png" class="delete-icon-result">
                </div>
              </div>
              `
          } else {
            subtaskResultHTML += `
              <div class="subtaskResult-${indexSubtaskName}">
                <div class="checklistSubtaskResult">
                </div>
                <div class="subtask-name-result">
                  <div class="subtaskName-${indexSubtaskName}">
                    ${subtaskName}
                  </div>
                  <img src="assets/Delete - Icon.png" class="delete-icon-result">
                </div>
              </div>
              `
          }
        }
      })
      document.querySelector(`.subtasksContainer-${subtasksId}`).innerHTML = subtaskResultHTML

      //CHECKLIST SUBTASK RESULT
      checklistSubtaskResult(subtasksId)

      //DELETE SUBTASK RESULT
      deleteSubtaskResult(subtasksId)
    }
  })
}

//Function CHECKLIST SUBTASK RESULT
function checklistSubtaskResult(subtasksId) {
  document.querySelectorAll(`.subtasksContainer-${subtasksId} .checklistSubtaskResult`).forEach((checklistSubtaskResult, indexChecklistSubtaskResult) => {
    checklistSubtaskResult.addEventListener('click', () => {
      checklistSubtaskResult.classList.toggle('checklistSubtaskResultClicked')
      
      elementCheck = document.querySelector(`.subtasksContainer-${subtasksId} .subtaskName-${indexChecklistSubtaskResult}`)
      elementCheck.classList.toggle('subtaskNameClicked')

      let index = checklistState.findIndex(item => item.id === subtasksId)
      if (checklistSubtaskResult.classList.contains('checklistSubtaskResultClicked')) {
        if (index === -1) {
          checklistState.push({
                                id: subtasksId,
                                checklistNames: [elementCheck.innerText]
                             })
        } else {
          checklistState[index].checklistNames = checklistState[index].checklistNames.concat([elementCheck.innerText]) 
        }
      } else {
        checklistState[index].checklistNames = checklistState[index].checklistNames.filter(item => item !== elementCheck.innerText);
      }

      setItem('checklistState', checklistState)
    })
  })
}

//Function to DELETE SUBTASK RESULT
function deleteSubtaskResult(subtasksId) {
  document.querySelectorAll(`.subtasksContainer-${subtasksId} .delete-icon-result`).forEach((deleteResult, indexDeleteResult) => {
    deleteResult.addEventListener('click', () => {
      let indexSubtaskList = subtaskList.findIndex(item => item.id === subtasksId)

      let indexChecklistState = checklistState.findIndex(item => item.id === subtasksId)

      const subtaskElement = document.querySelector(`.subtaskResult-${indexDeleteResult} .subtask-name-result div`)

      subtaskList[indexSubtaskList].subtaskNames = subtaskList[indexSubtaskList].subtaskNames.filter(item => item !== subtaskElement.innerText)

      checklistState[indexChecklistState].checklistNames = checklistState[indexChecklistState].checklistNames.filter(item => item !== subtaskElement.innerText)

      document.querySelector(`.subtaskResult-${indexDeleteResult}`).remove()

      setItem('subtaskList', subtaskList)
    })
  })
}

//Function to DISPLAY THREE POINTS
function displayThreePoints() {
  document.querySelectorAll("[class*='three-points']").forEach((threePoint) => {
    threePoint.addEventListener('click', () => {
      let taskId = threePoint.className.split('-')[2]
      threePoint.classList.toggle('three-points-clicked')
      
      if (threePoint.classList.contains('three-points-clicked')) {
        let div = document.createElement('div');
        const className = `rename-delete-${taskId}`;
        div.className = className;
        div.innerHTML = `
          <div class="rename-task-${taskId}">
              <img src="assets/Rename%20Icon.png">
              <div>Rename task</div>
          </div>
          <div class="delete-task-${taskId}">
              <img src="assets/Delete%20Icon%20Black.png">
              <div>Delete task</div>
          </div>
          `
        document.querySelector(`.primary-task-${taskId} .name-date`).appendChild(div)

        //REMOVE OTHER MENU
        document.querySelectorAll('[class*="rename-delete"]').forEach((element) => {
          if (element.className !== className) {
              //REMOVE ELEMENT
              element.remove()

              //REMOVE THREE POINTS CLICKED
              const otherIndex = element.className.split('-')[2]
              document.querySelector(`.three-points-${otherIndex}`).classList.remove('three-points-clicked')
          }
        })
      } else {
        taskId = threePoint.className.split('-')[2].split()[0]
        document.querySelector(`.rename-delete-${taskId}`).remove()
      }
      
      //DISPLAY RENAME TASK INPUT
      displayRenameTaskInput(taskId)

      //RENAME PRIMARY TASK
      renamePrimaryTask()

      //DELETE PRIMARY TASK
      document.querySelector(`.delete-task-${taskId}`).addEventListener('click', () => {
        deletePrimaryTask(taskId)
      })
    })
  })
}

//Function to DISPLAY RENAME TASK INPUT
function displayRenameTaskInput(taskId) {
  document.querySelector(`.rename-task-${taskId}`).addEventListener('click', () => {
    renderTask('rename', taskId)

    //Fill the input with the previous data
    let index = taskList.findIndex(item => item.id === taskId)
    document.querySelector('.task-input').value = 
    taskList[index].name

    document.querySelector('.desc-input').value = 
    taskList[index].desc

    document.querySelector('.date-input').value = 
    taskList[index].date

    //DISPLAY DATE INPUT
    displayDateInput()

    document.querySelector('.date-input').addEventListener('input', () => {
      //DISPLAY DATE INPUT
      displayDateInput()
    })
  })
}

//Function to RENAME PRIMARY TASK
function renamePrimaryTask() {
  todoList.addEventListener('keydown', (event) => {
    if (event.key === 'Control') {
      const taskInputContainer = document.querySelector('[class*="task-input-container"]')
      const taskId = taskInputContainer.className.split('-')[3]
      let index = taskList.findIndex(item => item.id === taskId)

      //Fill the input with the previous data
      taskList[index].name = document.querySelector('.task-input').value
      taskList[index].desc = document.querySelector('.desc-input').value
      taskList[index].date = document.querySelector('.date-input').value
      
      renderTask()
      changeTambahTugasButton()
      setItem('taskList', taskList)
    }  
  })
}

//Function to DELETE PRIMARY TASK
function deletePrimaryTask(taskId) {
  let index = taskList.findIndex(item => item.id === taskId)
  taskList.splice(index, 1)
  renderTask()
  setItem('taskList', taskList)
}

//Function to CHECKLIST PRIMARY TASK
function checklistPrimaryTask() {
  document.querySelectorAll(`[class*='checklist-primaryTask']`).forEach((checklist) => {
    checklist.addEventListener('click', () => {
      let taskId = checklist.className.split('-')[2]
      let index = taskList.findIndex(item => item.id === taskId)
      checklist.classList.toggle('checklist-primaryTaskClicked')

      if (checklist.classList.contains('checklist-primaryTaskClicked')) {
        const finishedTask = {...taskList[index]}
        finishedTasks.push(finishedTask)
      } else {
        taskId = checklist.className.split('-')[2].split[0]
        let index = finishedTasks.findIndex(item => item.id === taskId)
        finishedTasks.splice(index, 1)
      }

      setItem('finishedTasks', finishedTasks)

      //DISPLAY TOTAL FINISHED TASKS
      displayTotalFinishedTasks()

      //DELETE PRIMARY TASK
      deletePrimaryTask(taskId)
    })
  })
}

//Functin to DISPLAY TOTAL FINISHED TASKS
function displayTotalFinishedTasks() {
  if (finishedTasks.length > 0) {
    if (document.querySelector('.finished-tasks-container')) {
      document.querySelector('.finished-tasks-container').remove()
    }

    const div = document.createElement('div')
    div.className = "finished-tasks-container"
    div.innerHTML = `
      <div class="horizontal-line">
        <img src="assets/Horizontal%20Line.png">
      </div>
      <div class="total-finished-tasks">
        <div class="arrow-right">
        </div>
        <div class="total-finished-tasks-text">
          Terselesaikan (${finishedTasks.length} tugas)
        </div>
      </div>
      <div class="finished-tasks">
      </div>
      `
    document.querySelector('.todo-list').appendChild(div)

    //DISPLAY ARROW RIGHT
    const arrowRight = document.querySelector('.arrow-right')
    arrowRight.addEventListener('click', () => {
      displayArrowRight(arrowRight)
    })

  } else {
    try {
      document.querySelector('.finished-tasks-container').remove()
    } catch (error) {
      console.log(error.message)
    }
  }
}

//Function to DISPLAY ARROW RIGHT
function displayArrowRight(arrowRight) {
  arrowRight.classList.toggle('arrow-up-grey')
  
  if (arrowRight.classList.contains('arrow-up-grey')) {
    let finishedTasksHTML = ''

    finishedTasks.forEach((task) => {
      const {id, name} = task

      finishedTasksHTML += `
        <div class="finishedTaskResult-${id}">
          <div class="checklistSubtaskResult checklistSubtaskResultClicked-${id}">
          </div>
          <div class="finished-task-name-result">
            <div class="subtaskName-${id} subtaskNameClicked">
              ${name}
            </div>
            <div class="delete-finished-task-result-${id}">
            </div>
          </div>
        </div>
        `
    })
    document.querySelector('.finished-tasks').innerHTML = finishedTasksHTML

    //RESTORE PRIMARY TASK
    restorePrimaryTask()

    //DELETE FINISHED TASK
    deleteFinishedTask()

  } else {
    document.querySelector('.finished-tasks').innerHTML = ''
  }
}

//Function to RESTORE PRIMARY TASK
function restorePrimaryTask() {
  document.querySelectorAll('[class*="finishedTaskResult"] .checklistSubtaskResult').forEach((checklist) => {
    checklist.addEventListener('click', () => {
    const taskId = checklist.className.split('-')[1]
    const index = finishedTasks.findIndex(item => item.id === taskId)

    //Restore the data into the taskList 
    taskList.splice(taskList.length, 0, finishedTasks[index])
    renderTask()
    setItem('taskList', taskList)
    
    //Update finishedTasks
    finishedTasks.splice(index, 1)
    displayTotalFinishedTasks()
    if (finishedTasks.length > 0) {
      displayArrowRight(document.querySelector('.arrow-right'))
    }
    setItem('finishedTasks', finishedTasks)
    })
  })
}

//Function to DELETE FINISHED TASK
function deleteFinishedTask() {
  document.querySelectorAll('[class*="delete-finished-task-result"]').forEach((deleteIcon) => {
    deleteIcon.addEventListener('click', () => {
      const taskId = deleteIcon.className.split('-')[4]
      finishedTasks = finishedTasks.filter(item => item.id !== taskId)
      displayTotalFinishedTasks()
      if (finishedTasks.length > 0) {
        displayArrowRight(document.querySelector('.arrow-right'))
      }
      setItem('finishedTasks', finishedTasks)
    })
  })
}

//Function to DISPLAY BY TANGGAL
function displayByTanggal() {
  const byTanggal = document.querySelector('.by-tanggal')
  const arrowDownOrange = document.querySelector('.arrow-down-orange')
  byTanggal.addEventListener('click', () => {
    byTanggal.classList.toggle('by-tanggal-clicked')
    arrowDownOrange.classList.toggle('arrow-up-grey')

    const htmlUnclicked = `
      <div class="choices">
        <div class="choice">
          Terbaru <span class="terbaru"></span>
        </div>
        <div class="choice">
          Terlama <span class="terlama"></span>
        </div>
      </div>
      `
    
    const htmlClicked0 = `
      <div class="choices">
        <div class="choice">
          Terbaru <span class="terbaru choice-clicked"></span>
        </div>
        <div class="choice">
          Terlama <span class="terlama"></span>
        </div>
      </div>
      `
    
    const htmlClicked1 = `
      <div class="choices">
        <div class="choice">
          Terbaru <span class="terbaru"></span>
        </div>
        <div class="choice">
          Terlama <span class="terlama choice-clicked"></span>
        </div>
      </div>
      `

    if (byTanggal.classList.contains('by-tanggal-clicked')) {
      const div = document.createElement('div')
      if (byTanggalState === 'terbaru') {
        div.className = 'sort-by-choices'
        div.innerHTML = htmlClicked0
      } else if (byTanggalState === 'terlama') {
        div.className = 'sort-by-choices'
        div.innerHTML = htmlClicked1
      } else {
        div.className = 'sort-by-choices'
        div.innerHTML = htmlUnclicked
      }

      document.querySelector('.sort-by').appendChild(div)

    } else {
      document.querySelector('.sort-by-choices').remove()
    }

    //CHECKLIST BY TANGGAL
    checklistByTanggal()
  })
}

// Function to CHECKLIST BY TANGGAL
function checklistByTanggal() {
  const choiceButtons = document.querySelectorAll('.choice span');
  const terbaru = document.querySelector('.terbaru')
  const terlama = document.querySelector('.terlama')
  let choosenButton

  choiceButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      button.classList.add('choice-clicked')
      
      if (index === 0) {
        choosenButton = terbaru
        byTanggalState = 'terbaru'
        if (terlama.classList.contains('choice-clicked')) {
          terlama.classList.remove('choice-clicked')
        }
      } else if (index === 1) {
        choosenButton = terlama
        byTanggalState = 'terlama'
        if (terbaru.classList.contains('choice-clicked')) {
          terbaru.classList.remove('choice-clicked')
        }
      }
      
      //SORT BY TANGGAL
      sortByTanggal(choosenButton)
    })
  })
}

//Function to SORT BY TANGGAL
function sortByTanggal(choosenButton) {
  const terbaru = document.querySelector('.terbaru')
  const terlama = document.querySelector('.terlama')

  if (choosenButton === terbaru) {
    taskList.sort((obj1, obj2) => {
      const date1 = isNaN(new Date(obj1.date))? new Date('1900-01-01') : new Date(obj1.date)
      const date2 = isNaN(new Date(obj2.date))? new Date('1900-01-01') : new Date(obj2.date)
      return date2 - date1
    })
    renderTask()
    setItem('taskList', taskList)

  } else if (choosenButton === terlama) {
    taskList.sort((obj1, obj2) => {
      const date1 = isNaN(new Date(obj1.date))? new Date('1900-01-01') : new Date(obj1.date)
      const date2 = isNaN(new Date(obj2.date))? new Date('1900-01-01') : new Date(obj2.date)
      return date1 - date2
    })
    renderTask()
    setItem('taskList', taskList)
  }
}