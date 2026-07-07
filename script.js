const board = [
    [5,3,0,0,7,0,0,0,0],
    [6,0,0,1,9,5,0,0,0],
    [0,9,8,0,0,0,0,6,0],
    [8,0,0,0,6,0,0,0,3],
    [4,0,0,8,0,3,0,0,1],
    [7,0,0,0,2,0,0,0,6],
    [0,6,0,0,0,0,2,8,0],
    [0,0,0,4,1,9,0,0,5],
    [0,0,0,0,8,0,0,7,9]
];

// ==========================================
// ЛОГИКА АВТОСОХРАНЕНИЯ
// ==========================================
// Пытаемся достать сохраненную игру. Если её нет — делаем чистую копию начальной доски board.
const savedBoard = localStorage.getItem('sudokuProgress');
const currentBoard = savedBoard ? JSON.parse(savedBoard) : JSON.parse(JSON.stringify(board));

function createBoard() {
    const boardElement = document.getElementById('sudoku-board');
    boardElement.innerHTML = '';
    
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.min = 1;
            input.max = 9;
            
            // 1. Заполняем инпут значением из текущего прогресса (сохраненного или нового)
            if (currentBoard[row][col] !== 0) {
                input.value = currentBoard[row][col];
            }
            
            // 2. Блокируем ячейку ТОЛЬКО если она была изначально заполнена в шаблоне board
            if (board[row][col] !== 0) {
                input.disabled = true;
                input.style.backgroundColor = '#f0f0f0';
            } else {
                // Если это пустая клетка для игрока, вешаем на нее слежку
                input.addEventListener('input', function() {
                    // Ограничение на 1 символ (наш прошлый код)
                    if (this.value.length > 1) {
                        this.value = this.value.slice(0, 1);
                    }
                    
                    // Обновляем число в нашем рабочем массиве памяти
                    currentBoard[row][col] = this.value ? parseInt(this.value) : 0;
                    
                    // Сохраняем обновленный массив в localStorage (переводим его в JSON-строку)
                    localStorage.setItem('sudokuProgress', JSON.stringify(currentBoard));
                });
            }
            
            boardElement.appendChild(input);
        }
    }
}
 
// Находим кнопки меню и страницы
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page-view');

navItems.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault(); // Отменяем стандартный прыжок браузера по хэшу (#)

        // 1. Переключаем активную кнопку в меню
        navItems.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');

        // 2. Скрываем все страницы
        pages.forEach(page => page.classList.remove('active'));

        // 3. Находим нужную страницу по href кнопки и показываем её
        // Если clicked href="#profile", то мы ищем id="profile-view"
        const targetId = this.getAttribute('href') + '-view'; 
        document.querySelector(targetId).classList.add('active');
    });
});

createBoard();