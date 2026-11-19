const form = document.querySelector('#add-task');
const title = document.querySelector('#title');
const list = document.querySelector('#tasks');
const status = document.querySelector('#status');

async function request(path, body, method = 'GET') {
  const response = await fetch(path, body === undefined ? undefined : {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`서버 요청 실패 (${response.status})`);
  return response.json();
}

function renderTask(task) {
  const row = document.createElement('li');
  const label = document.createElement('label');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.addEventListener('change', async () => {
    checkbox.disabled = true;
    try {
      const saved = await request(`/api/tasks/${task.id}`, { completed: checkbox.checked }, 'PATCH');
      task.completed = saved.completed;
      status.textContent = '완료 상태를 저장했습니다.';
    } catch (error) {
      checkbox.checked = task.completed;
      status.textContent = error.message;
    } finally {
      checkbox.disabled = false;
    }
  });
  label.append(checkbox, task.title);
  row.append(label);
  return row;
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  const value = title.value.trim();
  if (!value) return;
  const button = form.querySelector('button');
  button.disabled = true;
  try {
    const task = await request('/api/tasks', { title: value }, 'POST');
    list.append(renderTask(task));
    if (title.value.trim() === value) title.value = '';
    status.textContent = '할 일을 추가했습니다.';
  } catch (error) {
    status.textContent = error.message;
  } finally {
    button.disabled = false;
  }
});

form.querySelector('button').disabled = true;
request('/api/tasks').then(tasks => {
  list.replaceChildren(...tasks.map(renderTask));
  status.textContent = tasks.length ? '목록을 불러왔습니다.' : '할 일을 하나 추가해 보세요.';
  form.querySelector('button').disabled = false;
}).catch(error => {
  status.textContent = `${error.message}. 서버를 확인한 뒤 새로고침하세요.`;
});
