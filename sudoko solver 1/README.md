# Sudoku Game

A modern web-based Sudoku game that combines algorithmic problem-solving with engaging user interface design. The game features a backtracking algorithm for puzzle generation and solving, user authentication, local storage for progress tracking, and a responsive design with smooth animations.

## Features

### Core Game Features
- 9x9 Sudoku grid with interactive cells
- Backtracking algorithm for puzzle generation and solving
- Real-time validation of user inputs
- Timer to track solving time
- Score and trophy system
- Multiple difficulty levels

### User Interface
- Responsive design that works on all devices
- Smooth animations and transitions
- Interactive number pad
- Visual feedback for correct/incorrect numbers
- Modal-based authentication system

### User Features
- User registration and login
- Progress tracking with local storage
- Score accumulation
- Trophy system (earned by reaching score milestones)
- Last played timestamp

## Technical Implementation

### Data Structures & Algorithms
1. **Backtracking Algorithm**
   - Used for generating and solving Sudoku puzzles
   - Time Complexity: O(9^(n*n)) where n is the grid size
   - Recursively tries different numbers in empty cells

2. **2D Arrays/Matrices**
   - Used to represent the 9x9 Sudoku grid
   - Stores puzzle state, solution, and initial board

### Frontend Technologies
1. **HTML5**
   - Semantic structure
   - Modal dialogs
   - Responsive layout

2. **CSS3**
   - Grid and Flexbox layouts
   - CSS Variables for theming
   - Animations and transitions
   - Media queries for responsiveness
   - Box-shadow and gradient effects

3. **JavaScript**
   - DOM manipulation
   - Event handling
   - Local Storage API
   - Array methods
   - Object-Oriented Programming concepts

## Getting Started

1. Clone the repository
2. Open `index.html` in a modern web browser
3. Register a new account or login
4. Start playing!

## Game Rules

1. Fill the 9x9 grid with numbers 1-9
2. Each row, column, and 3x3 box must contain unique numbers
3. Initial numbers cannot be modified
4. Earn points by correctly placing numbers
5. Earn trophies by accumulating 1000 points
6. Use the "Check Solution" button to verify your progress
7. Use the "Solve Puzzle" button for hints (with a small point penalty)

## Browser Support

The game is compatible with all modern browsers that support:
- HTML5
- CSS3 Grid and Flexbox
- ES6+ JavaScript
- Local Storage API

## Contributing

Feel free to submit issues and enhancement requests! 