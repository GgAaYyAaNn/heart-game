# Heart Game

**Live Demo:** [https://ggaayyaann.github.io/heart-game/](https://ggaayyaann.github.io/heart-game/)

An interactive web-based game where players reveal tiles to find all the hidden hearts before running out of guesses.  


## Game Overview

Players click tiles to reveal **hearts** or **carrots**.  
The goal is to find all the hidden hearts within a limited number of attempts.  
If the player fails, they can earn another chance by solving a puzzle fetched from the **Heart API**.

---

## Features

- **Heart API Integration**  
  Fetches heart-count puzzles dynamically from [Marc Conrad’s Heart API](https://marcconrad.com/uob/heart/api.php).

- **Firebase Integration**
    - Google Authentication (sign in with Google)
    - Realtime Database to store user scores
    - Public leaderboard