---
title: Day 4 - Camp Cleanup 🧹
description: A solution to day 4
template: doc
---

The elves were almost done unloading their supplies when they realized that their camp was out of space. They prepare to clear up some space. However, they are faced with a problem! Let's help them, shall we?

---

## Analysing the input

The input given are pairs of ranges of **Unique IDs** that refer to sections of the camp.

```
2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8
```

In each line, the part on either side of the commas is the range of sections that the respective elves are assigned to clean up.

## Part 1

In part 1, we are required to find the total number of pairs in which the one of the ranges is fully contained in the other. For example, in line 4 of the sample input, `3-7`, i.e., the numbers `3..7` is fully contained in `2-8`, i.e., `2..8`.

This can be done by taking a count of the number of pairs in which the first ID of one range is less than the first ID of the second range and the last ID of the same range is greater than the last ID of the other. In the above example, `2` is lesser than `3` and `8` is greater than `7`. 

### Splitting each line into two lists

We'll be using a function `splitInTwo(line: String): List<List<Int>>` that takes in a `String` value as a parameter and returns a `List` of two lists containing two integers each.

First let's do some splitting. 😉

##### Step 1 - The ***Main*** Split

The [`split()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/split.html) function is used to split the String value (`line`) by commas (`,`). The result will be a `List` of two `String` values.

```kotlin
line.split(",")
```

We have not assigned the result to a variable because we'll be using a [Lambda](https://kotlinlang.org/docs/lambdas.html) expression to `return` the final result directly.

##### Step 2 - The ***Sub*** Split and Conversion to Integers

Now that we have two `String` values, we need to split them further and convert them to `Int` values.

Yeah you guessed it. The `split()` function will be used yet again. But this time round, that alone wouldn't suffice. The [`map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html) function has to be used to convert each element of the `List` to an `Int` value along with the [`toInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int.html) function. We'll be using the [`toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-list.html) function too.

```kotlin
val first = it[0].split("-").map { it.toInt() }.toList()
val second = it[1].split("-").map { it.toInt() }.toList()
```

Awesome! Now we have two `List` variables with the first IDs and last IDs of the two ranges in the pair.

##### Step 3 - Merging the ***Splits*** into a single function

[Scope functions](https://kotlinlang.org/docs/scope-functions.html) are the best in class for this kind of stuff. We'll be using the [`let`](https://kotlinlang.org/docs/scope-functions.html#let) function here. 

```kotlin
line.split(",").let { it ->
    val first = it[0].trim().split("-").map { it.toInt() }.toList()
    val second = it[1].trim().split("-").map { it.toInt() }.toList()
}
```

### The Complete Function

Adding a `return` statement to our code, we finally have our `splitInTwo()` function. Our `List` of lists is ready. 🤣

```kotlin
fun splitInTwo(line: String): List<List<Int>> {
    line.split(",").let { it ->
        val first = it[0].split("-").map { it.toInt() }.toList()
        val second = it[1].split("-").map { it.toInt() }.toList()
        return listOf(first, second)
    }
}
```

### Taking the Count

All that's left to do is take the final count of pairs that satisfy the condition we figured out earlier. The [`count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) function will sure be useful here, don't you think? It returns the number of items in a `List` that satisfies the given condition.

```kotlin
fun main() {
    val part1 = input.count { l ->
        val list = splitInTwo(l)
        (list[0][0] <= list[1][0] && list[0][1] >= list[1][1]) || (list[0][0] >= list[1][0] && list[0][1] <= list[1][1])
    }
}
```

### Solution

```kotlin
fun main() {
    val part1 = input.count { l ->
        val list = splitInTwo(l)
        (list[0][0] <= list[1][0] && list[0][1] >= list[1][1]) || (list[0][0] >= list[1][0] && list[0][1] <= list[1][1])
    }
    println(part1)
}

fun splitInTwo(line: String): List<List<Int>> {
    line.split(",").let { it ->
        val first = it[0].split("-").map { it.toInt() }.toList()
        val second = it[1].split("-").map { it.toInt() }.toList()
        return listOf(first, second)
    }
}
```

## Part 2

Part 2 also deals with the same problem but this time any kind of overlap in the ID ranges of the elves in each pair must be taken into account.

### Checking for Overlap

The [`intersect()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/intersect.html) function can be used to return the common elements in two lists. This function returns a `Set` and if the returned `Set` is not empty then we know that there is an overlap between the two lists. This can be checked using the [`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html) function.

```kotlin
(list[0][0]..list[0][1]).intersect(list[1][0]..list[1][1]).isNotEmpty()
```

### Taking the Count

Just like Part 1, here too we can use the [`count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) function and the custom `splitInTwo()` function.

```kotlin
val part2 = input.count { l ->
    val list = splitInTwo(l)
    (list[0][0]..list[0][1]).intersect(list[1][0]..list[1][1]).isNotEmpty()
}
```

### Solution

```kotlin
fun main() {
    val part2 = input.count { l ->
        val list = splitInTwo(l)
        (list[0][0]..list[0][1]).intersect(list[1][0]..list[1][1]).isNotEmpty()
    }
}

fun splitInTwo(line: String): List<List<Int>> {
    line.split(",").let { it ->
        val first = it[0].trim().split("-").map { it.toInt() }.toList()
        val second = it[1].trim().split("-").map { it.toInt() }.toList()
        return listOf(first, second)
    }
}
```

That's a wrap on Day4!

## Full Solution

```kotlin
fun main() {
    val input = readInput("Day04")
    val part1 = input.count { l ->
        val list = splitInTwo(l)
        (list[0][0] <= list[1][0] && list[0][1] >= list[1][1]) || (list[0][0] >= list[1][0] && list[0][1] <= list[1][1])
    }
    val part2 = input.count { l ->
        val list = splitInTwo(l)
        (list[0][0]..list[0][1]).intersect(list[1][0]..list[1][1]).isNotEmpty()
    }
    println(part1)
    println(part2)
}
fun splitInTwo(line: String): List<List<Int>> {
    line.split(",").let { it ->
        val first = it[0].split("-").map { it.toInt() }.toList()
        val second = it[1].split("-").map { it.toInt() }.toList()
        return listOf(first, second)
    }
}

```

[Open in Playground](https://pl.kotl.in/uEe_I8GjE) [GitHub](https://github.com/Sasikuttan2163/AoC-2022-Solutions-In-Kotlin/blob/main/src/Day04.kt)