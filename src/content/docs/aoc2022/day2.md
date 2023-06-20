---
title: Day 2 - Rock Paper Scissors ✂️
description: A solution to Day 2
template: doc
---
In this post I'll be explaining my [day 2](https://adventofcode.com/2022/day/2)
solution to [Advent of Code 2022](https://adventofcode.com/2022). First things first,
lets read the input! Once again I'll be using the `readInput()`method provided in the 
[AoC Kotlin template by JetBrains](https://github.com/kotlin-hands-on/advent-of-code-kotlin-template).

```kotlin
val input = readInput("Day02")
```
---
## Part 1

### Analyzing the data
The meaning of the input is completely different in part 1 and part 2 which is why
I'm not explaining the input before solving each part.

```
A Y
B X
C Z
```

The input is an encrypted strategy guide where the first column is the move made by your
opponent and second column has the moves you should do. 

```
A -> rock     <- X (1 point)
B -> paper    <- Y (2 points)
C -> scissors <- Z (3 points)
```
A, B and C represent your opponent's moves and X, Y and Z show your moves. Each move you make
has a score associated with it as shown above. Apart from that, you'll get extra points for
a **win** (6 points) and **draw** (3 points).

For example in the first round, the opponent chooses Rock and you play Paper. Since you played
Paper, you get 2 points. Paper beats Rock which means you won the round, giving 6 points for a
total of 8.

### [`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html) -ing the data
Instead of breaking the solution part by part, the whole process can be finished in just one
operation on the input using the convenient [`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html) function in the [Collections API](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/).

```kotlin
val part1 = input.fold(0) { sum, l ->
    sum + ...
}
```

The initial value of `sum` is set to 0 and `l` represents each line in `input`. From here on we'll
be using ASCII to help with the code logic. 

### Computing the result

`l[0]` represents the first character which is the opponent's
move (A, B or C). Likewise `l[2]` represents your move (X, Y or Z). We can assign number 0 for Rock, 
1 for Paper and 2 for Scissors. `l[2] - 'X'` and `l[0] - 'A'` use ASCII codes to convert the input
to this form. 

If the number of the opponent's move and your move turns out to be the same, the round ends in a draw
giving 3 points.

Now that we know who makes which move, there are three possible scenarios - win, loss or draw.
There are three ways to win - Paper (1) beats Rock (0), Scissors (2) beats Paper (1) and Rock (0)
beats Scissors(2). Whenever we win, the difference between your move and the opponent's is 1 or -2.
This gives 6 points.

Finally, if the difference between the codes turns out to be anything else, the round ends in a loss
giving 0 points.

```kotlin
when ((l[2] - 'X') - (l[0] - 'A')) {
    0 -> 3
    1, -2 -> 6
    else -> 0
}
```
The only thing left is to add the points of our move as per the scheme. X gives one point, Y
gives 2 and Z gives three. An easy way to get that number would be to subtract the ASCII of 
`'W'` from `l[2]`.

```kotlin
(l[2] - 'W')
```

Adding these to `sum` we reach the solution of part 1.

### Solution
```kotlin
val part1 = input.fold(0) { sum, l ->
    sum + when ((l[2] - 'X') - (l[0] - 'A')) {
        0 -> 3
        1, -2 -> 6
        else -> 0
    } + (l[2] - 'W')
}
```
---
## Part 2

### Analyzing the data
In part 2 we come to know that the second column of the strategy guide encodes the outcome of
a round where X means loss, Y - draw and Z - win.

```
A Y     # rival - rock, result - draw => you - rock
B X     # rival - paper, result - loss => you - rock 
C Z     # rival - scissors, result - win => you - rock
```

The scoring system is same as before. The real challenge here is mapping the choice you need to
make for achieving the outcome. Once again [`fold()`](#fold--ing-the-data) can be used to make the code concise.


### Finding the result
First we store the result of the round to a variable `res` where 0 represents loss, 1 means draw
and 2 signifies a win.

```kotlin
val res = l[2] - 'X'
```

`res * 3` gives the score of the result of the round.

### Deciding your move
Using the number codes for rock paper and scissors from [computing the result](#computing-the-result)
section of part 1 we can find the opponent's move which will decide yours. `l[0] - 'A'` returns the
opponent's move in the number code.

#### Loss
When the result is a loss there are three possibilities:
```
Rival - Rock (0)    =>  You - Scissors (3 points)
Rival - Paper (1)   =>  You - Rock (1 point)
Rival - Scissor (2) =>  You - Paper (2 points)

```
Looking at this we can say that when the code is 0 (Rock), you get 3 points. Otherwise the score 
is same as the number code of the opponent's move. This can be reduced to:
```kotlin
if (l[0] != 'A') l[0] - 'A' else 3
```

#### Draw
A draw means the score is the same as the score of the opponent's move which is `code + 1`. For example
when the opponent chooses Rock (0) to make it a draw you choose Rock too which gives 1 point.
```kotlin
l[0] - 'A' + 1
```

#### Win
There are three ways you can win:
```
Rival - Rock (0)    =>  You - Paper (2 points)
Rival - Paper (1)   =>  You - Scissors (3 point)
Rival - Scissor (2) =>  You - Rock (1 points)
```
As long as the opponent doesn't choose Scissors (2), the score from the will be `code + 2`. When
the opponent's choice is Scissors (0) the score becomes 1. 
```kotlin
if (l[0] != 'C') l[0] - 'A' + 2 else 1
```

#### Summing it up
Wrapping the above conditionals inside `when` we get: 
```kotlin
when (res) {
    0 -> if (l[0] != 'A') l[0] - 'A' else 3
    1 -> l[0] - 'A' + 1
    2 -> if (l[0] != 'C') l[0] - 'A' + 2 else 1
    else -> 0
}
```
The `else` block is never executed because all the possibilities have been exhausted. It is only
to ensure that the compiler detects that it always returns an `Int`.

Now that we have all the elements needed to compute the score, all that remains is to 
[`fold()`](#fold--ing-the-data) the data once again to get the total score.

### Solution


```kotlin
 val part2 = input.fold(0) { sum, l ->
    val res = l[2] - 'X'
    sum + res * 3 + when (res) {
        0 -> if (l[0] != 'A') l[0] - 'A' else 3
        1 -> l[0] - 'A' + 1
        2 -> if (l[0] != 'C') l[0] - 'A' + 2 else 1
        else -> 0
    }
}
```
Congrats on completing day 2 in Kotlin!

## Full Solution
```kotlin
fun main() {
    val input = readInput("Day02")
    val part1 = input.fold(0) { sum, l ->
        sum + when ((l[2] - 'X') - (l[0] - 'A')) {
            0 -> 3
            1, -2 -> 6
            else -> 0
        } + (l[2] - 'W')
    }
    val part2 = input.fold(0) { sum, l ->
        val res = l[2] - 'X'
        sum + res * 3 + when (res) {
            0 -> if (l[0] != 'A') l[0] - 'A' else 3
            1 -> l[0] - 'A' + 1
            2 -> if (l[0] != 'C') l[0] - 'A' + 2 else 1
            else -> 0
        }
    }
    part1.println()
    part2.println()
}
```
[Open in Playground](https://pl.kotl.in/4LsjxicmI) [GitHub](https://github.com/Sasikuttan2163/AoC-2022-Solutions-In-Kotlin/blob/main/src/Day02.kt)
