/**
 * Complete the implementation of parseStory.
 *
 * parseStory retrieves the story as a single string from story.txt
 * (I have written this part for you).
 *
 * In your code, you are required (please read this carefully):
 * - to return a list of objects
 * - each object should definitely have a field, `word`
 * - each object should maybe have a field, `pos` (part of speech)
 *
 * So for example, the return value of this for the example story.txt
 * will be an object that looks like so (note the comma! periods should
 * be handled in the same way).
 *
 * Input: "Louis[n] went[v] to the store[n], and it was fun[a]."
 * Output: [
 *  { word: "Louis", pos: "noun" },
 *  { word: "went", pos: "verb", },
 *  { word: "to", },
 *  { word: "the", },
 *  { word: "store", pos: "noun" }
 *  { word: "," }
 *  ....
 *
 * There are multiple ways to do this, but you may want to use regular expressions.
 * Please go through this lesson: https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/regular-expressions/
 */

function parseStory(rawStory) {
  const storyPreview = document.querySelector(".madLibsPreview");
  const storyContainer = document.querySelector(".madLibsEdit");

  // create an object holding the input word types and their corresponding placeholders
  const wordTypes = [
    { type: "n", placeholder: "noun" },
    { type: "v", placeholder: "verb" },
    { type: "a", placeholder: "adjective" },
  ];

  // create the output list of existing objects
  function getWordsWithPos(input) {
    const regex = /(\w+)(?:\[(\w+)\])?/g; // regular expression to match words and parts of speech

    let match;
    const result = [];

    while ((match = regex.exec(input)) !== null) {
      const [_, word, pos] = match;
      const obj = { word };

      if (pos === "n") {
        obj.pos = "noun";
      } else if (pos === "v") {
        obj.pos = "verb";
      } else if (pos === "a") {
        obj.pos = "adjective";
      }
      result.push(obj);
    }

    return result;
  }

  // find the word types and exchange them with input elements
  let storyHTML = rawStory;
  wordTypes.forEach((wordType) => {
    const regex = new RegExp(`\\[${wordType.type}\\]`, "g");
    storyHTML = storyHTML.replace(
      regex,
      ` <input type="text" placeholder="${wordType.placeholder}" class="${wordType.type}">`
    );
  });
  storyContainer.innerHTML = storyHTML; // story container containes the word types as input elements

  //create an array from input elements and give each of them an id
  const inputElements = document.querySelectorAll(".madLibsEdit input");
  const inputArray = Array.from(inputElements);

  for (let i = 0; i < inputArray.length; i++) {
    let inputElement = inputArray[i];
    inputElement.setAttribute("id", i);
    const savedValue = localStorage.getItem(`${inputElement.id}`);
    if (savedValue !== null) {
      inputElement.value = savedValue;
      if (inputElement.value.length > 0) {
        inputElement.classList.add("filled-input");
      }
    }
  }

  // when user presses enter in an input element, move to next input element (keycode 13 -> enter)
  inputArray.forEach((input, index) => {
    input.addEventListener("keydown", (event) => {
      if (event.keyCode === 13) {
        const nextInput = inputArray[index + 1];
        if (nextInput) {
          nextInput.focus();
        }
      }
    });

    // if the input value is more than 20 characters, restrict typing and show error message
    input.addEventListener("input", () => {
      if (input.value.length > 20) {
        input.value = input.value.slice(0, 20);
        error.style.display = "block";
      } else {
        error.style.display = "none";
      }
    });
  });

  //create a paragraph element corresponding each input element
  let previewHTML = rawStory;
  wordTypes.forEach((wordType) => {
    const regex = new RegExp(`\\[${wordType.type}\\]`, "g");
    const words = previewHTML.split(regex);
    console.log(words);
    console.log(previewHTML);
    // const newWords = words.map((word) => {
    //   if (word === "") return "";
    //   return `<p class="${wordType.type}"></p>${word}`;
    // });
    // previewHTML = newWords.join("");
    previewHTML = previewHTML.replace(
      regex,
      `<p class="${wordType.type} colorful"></p>`
    );
  });
  console.log(previewHTML);
  storyPreview.innerHTML = previewHTML; // story preview contains p elements corresponding to word type input elements
  console.log(storyPreview.innerHTML);
  // create an array from the p elements in the preview and give each p an id matching the corresponding input element
  const previewInputElements = document.querySelectorAll(".madLibsPreview p");
  const previewInputArray = Array.from(previewInputElements);

  for (let i = 0; i < previewInputArray.length; i++) {
    let previewInputElement = previewInputArray[i];
    previewInputElement.setAttribute("id", i);
  }

  // create input event to update the preview live
  for (let i = 0; i < inputArray.length; i++) {
    let inputElement = inputArray[i];
    inputElement.addEventListener("input", replaceBlank);
    function replaceBlank() {
      previewInputArray.forEach((previewInput) => {
        if (previewInput.id == i) {
          console.log(inputElement.value);
          previewInput.textContent = inputElement.value;
        }
      });
    }
  }

  // change text nodes in story preview with p elements
  const children = storyPreview.childNodes;

  children.forEach((child) => {
    if (child.nodeType === 3) {
      // If the child node is a text node, wrap it in a paragraph element
      const p = document.createElement("p");
      p.textContent = child.textContent;
      storyPreview.replaceChild(p, child);
    }
  });

  // create a single text with existing and inputted texts
  let combinedText = "";
  const pElements = storyPreview.querySelectorAll("p");
  pElements.forEach((pElement) => {
    if (pElement.className.length > 0) {
      const id = pElement.id;
      const savedValue = localStorage.getItem(id);
      if (savedValue) {
        //pElement.value = savedValue;
        pElement.textContent = savedValue;
      }
    }
    combinedText += pElement.textContent;
  });

  storyPreview.innerHTML = "";
  const previewText = document.createElement("p");
  previewText.classList.add("preview-text");
  previewText.textContent = combinedText;
  storyPreview.appendChild(previewText);

  for (let i = 0; i < inputArray.length; i++) {
    let inputElement = inputArray[i];
    inputElement.addEventListener("input", () => {
      // Update the text content of the corresponding <p> element
      const id = inputElement.id;
      const p = storyPreview.querySelector("p#id");

      if (inputElement.value.length > 0) {
        inputElement.classList.add("filled-input");
      } else {
        inputElement.classList.remove("filled-input");
      }
      localStorage.setItem(`${inputElement.id}`, inputElement.value);

      // Update the combined text
      combinedText = "";
      pElements.forEach((p) => {
        combinedText += p.textContent;
      });

      let updatedPreviewText = previewText;
      updatedPreviewText.textContent = combinedText;
      storyPreview.replaceChild(updatedPreviewText, previewText);
    });
  }

  return getWordsWithPos(rawStory);
}

/**
 * All your other JavaScript code goes here, inside the function. Don't worry about
 * the `then` and `async` syntax for now.
 *
 * NOTE: You should not be writing any code in the global namespace EXCEPT
 * declaring functions. All code should either:
 * 1. Be in a function.
 * 2. Be in .then() below.
 *
 * You'll want to use the results of parseStory() to display the story on the page.
 */
getRawStory()
  .then(parseStory)
  .then((processedStory) => {
    console.log(processedStory);
  });
