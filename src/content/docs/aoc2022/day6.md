---
title: Day 6 - Tuning Trouble 😵‍💫
description: A solution to day 6
template: doc
---

The elves sure hold us in high esteem. They were confident enough to give us a malfunctioning communication device, thinking we'd have no trouble getting it to work. 

---

## Analysing the Input

What we are given is a **datastream buffer** that the device produces.

```
mjqjpqmgbljsphdztnvjfqwrcgsmlb
```

This is a series of lowercase letters.

## Part 1

We are required to write a subroutine, our solution, that finds the first position in the datastream, our input, where *four* consecutive characters are different.

Let's consider our sample input. The first set of characters we should consider is `mjqj`. Here the character *`j`* is repeated. Hence it does not satisfy out condition. The next sets of characters to consider is `jqjp`, `qjpq`, ... and so on. 

We see that the first marker is after the 7th character, i.e., `jpqm` doesn't have characters repeated, where *'m'* is the 7th character in the buffer.

### `packetFinder()` Function

```kotlin
fun packetFinder (packetLength: Int): Int
```

Our function takes the `packetLength` as a parameter, which in this case is **4**, and returns the position of the character which is the packet marker.

First let's convert `input` to a `String` value. We can use the [`joinToString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/join-to-string.html) function to do that.

:::note[Note]
The [`toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to-string.html) function doesn't work in this case because it adds the **square brackets** on either side of the `List` as a part of the `String` as well.

This can be rectified by using the [`drop()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/drop.html) and [`dropLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/drop-last.html) functions but that's just more code...
:::

Now that we have our `String` we can use the [`windowed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/windowed.html) function which saves us a ton of work. It returns a `List` of strings in the exact same way we want in this case. For example, `mjqjpqmgbljsphdztnvjfqwrcgsmlb` would be returned as a `List` containing `mjqj`, `jqjp`, `qjpq`, and so on...

Moving on, the [`Set`](https://kotlinlang.org/docs/kotlin-tour-collections.html#set) collection in Kotlin doesn't allow duplicate elements in the same `Set` right? Then why not convert every `String` in our `List` to a `Set`? Let's do that using the [`map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html) function which applies the specified transform function, convertion to `Sets` in our case, to each element in a collection. We'll also use the [`toSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-set.html) function to do the convertion.

```kotlin
map { it.toSet() }
```

As we know, `Sets` don't contain duplicate. So the `String` values that contained duplicates would now contain less than 4 characters. Then the [first](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of-first.html) `Set` in the list that contains 4 characters should be the packet we're looking for.

```kotlin
indexOfFirst { it.size >= packetLength }
```

However, we're not done yet. There's one last thing we need to care of.

If you've noticed, it's the position number of the last character of the `String` that should be returned. See the example at the start of this page. It's 7 that should be returned and not 4.

To do this, let's add `packetLength` to the result.

```kotlin
indexOfFirst { it.size >= packetLength } + packetLength
```

The full function is as follows:

```kotlin
fun packetFinder (packetLength: Int): Int {
    return input
        .joinToString()
        .windowed(packetLength)
        .map { it.toSet() }
        .indexOfFirst { it.size >= packetLength } + packetLength
}
```

## Solution

```kotlin
fun packetFinder (packetLength: Int): Int {
    return input
        .joinToString()
        .windowed(packetLength)
        .map { it.toSet() }
        .indexOfFirst { it.size >= packetLength } + packetLength
}
val part1 = packetFinder(4)
println(part1)
```

### Part 2

Part 2 is exactly similar to part 1 except that this time the length of the packets are 14.

## Solution

```kotlin
fun packetFinder (packetLength: Int): Int {
    return input
        .joinToString()
        .windowed(packetLength)
        .map { it.toSet() }
        .indexOfFirst { it.size >= packetLength } + packetLength
}
val part2 = packetFinder(14)
println(part2)
```

### Full Solution

```kotlin
fun main() {
    val input = readFile("Day6")
    fun packetFinder (packetLength: Int): Int {
        return input
            .joinToString()
            .windowed(packetLength)
            .map { it.toSet() }
            .indexOfFirst { it.size >= packetLength } + packetLength
    }
    val part1 = packetFinder(4)
    println(part1)
    val part2 = packetFinder(14)
    println(part2)
}
```

[Open in Playground](https://pl.kotl.in/j9kcSIzlR)