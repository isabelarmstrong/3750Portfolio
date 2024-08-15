## About Me
I am Isabel Armstrong and I am 20 years old. I am currently a student at Weber State University. Upon graduation, I aim to land myself a career in software development. I find the subject of computer science to be very compelling and am always wanting to learn more. 

## Projects
### ![Node Express](https://github.com/isabelarmstrong/3750Portfolio/tree/main/node-express)

![2024-08-1419-27-34-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/b5c6b0ec-5c63-40f9-a3ec-098d19c61141)

For this assignment, I created two different forms. One prompts the user for their name and their favorite food, which is them saved to a text file. It then displays all users and their favorite foods. On the other form, it prompts for just a favorite food to search by. When submitted, the next page then displays the users with the given food as their favorite food.

Since I was new to Node at the time, I did have a hard time with some of the aspects of this assginment. I had a hard time understanding how exactly I could read and write to a text file. I did eventually figure what exactly I needed to use and how to use it to my advantage.

### ![Connect Four](https://github.com/isabelarmstrong/3750Portfolio/tree/main/node-express)

![2024-08-1419-43-53-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/db6bf786-afc1-4236-8d40-9c3d475ea4b8)

For this assignmnet, we had to create a connect four game that would allow a horizontal, vertical, or diagonal win from either player.

The connect four assignment was particularly challenging for me. At first, I wasn't entirely sure how I should've made the grid to keep track of the moves, but I eventually figured out I could make a sort of 2D array to hold all the information. Once I got past that bump, the rest was pretty straightforward until I had to figure out how to calculate the wins. Horizontal and Vertical wins were easy since I could just make a nested for loop and count how many squares around the newest move had the same symbol in a line. The diagonal wins were more complicated as more calculations were involved. First, I created the definitions of the diagonal lines to check. Then, I created a nested for loop. The outer loop checks every direction and the inner for loop checks for every row and column in that direction. Lastly, I checked for a tie by checking if the entire board was filled without any wins. In any case, it could either display the winner or that it was a tie and the users could refresh the page to start a new game.

### ![MERN and Sessions](https://github.com/isabelarmstrong/3750Portfolio/tree/main/mern-sessions)

![2024-08-1419-46-16-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/7e1c17bd-949c-43a4-a23c-f5178390347f)

For this assignment, we had to utilize sessions and communication with a database to create a make-shift banking application that customers can use to see and modify a checking and savings account.

This assignment had it's own challenges as well, for both the front and backend. In the backend, the part that I had the most issues with was how to allow for transfer of money between accounts. It was a requirement that amounts were stored as a string in the database, such as $20 would read as "2000", which made it really difficult for me to figure out how exactly I could go in and change these amounts. What I ended up doing was firstly grabbing the amount that is being transferred and the old amount of money in the account that is being transferred from. Then, I change these amounts to floats and do the proper calculations to deduct the proper amount. Then, I grab the amount in the account that is being transferred to, convert that to a float as well, and do the proper calculations. Then, to finish it all off I save the new values of both accounts to the database.

For the front end bit of the assignment, the thing I had the hardest time with were figuring out the sessions. It was a requirement to create session tracking information for handling registration of a new account and login of an existing account as well as a logout route to destroy said information. With this, I also had to check that a user was already logged in as to prevent people who aren't logged in from seeing sensitive information. How I went about this was storing the user's email when they either created a new account or logged in. With this information, I could easily get the email by requesting the current session, and looking the person up to see that they existed in the database as needed.

### ![Hangman Game](https://github.com/isabelarmstrong/3750Portfolio/tree/main/CS3750Group-Skittles-HangMan-Assignment-main)

![2024-08-1422-23-16-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/203bb8db-500d-400c-87cd-0644f5a52ea9)

This assignment was a group project where we had to create a functioning game of hangman. In my group, I helped build the highscore page and utilize sessions.

When it came to utilizing sessions in this assignment, it came much easier with the practice that I had in the previous assignment. However, I did have troubles with the highscores page and getting the necessary information to it to display. This fix on this was was pretty simple, however. After a bit of research, I realized that I could utlize hooks and pass the necessary information from the game page through the url. In the highscores page, I could then grab that information from the url and display it on the actual page.

### ![Banking App](https://github.com/isabelarmstrong/3750Portfolio/tree/main/Banking-App)

![2024-08-1422-33-38-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/8bc4f5a1-8f28-4866-9f3a-e45fa2c31e6d)

This was the final group assignment where we had to build upon the previous banking app project and add more features. In this case, we had to create new and unique actions for customers, employees, and administrators. In this project, I helped build the features for the administrator. This role could access all screens and elevate/demote rights of other users.

The backend portion of this assignment was pretty straight forward as I just had to pass the new role of a user to the backend and commit that to that specific user. In the frontend, it was a little more difficult as I decided to only use one page to change every user's role. To figure this out, I used props to display each user. Each prop has its own event handler so when a role for a specific user is changed, it can easily pass the new role and the user's email to the function that will handle the backend.
