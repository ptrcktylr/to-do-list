import bootstrap from 'bootstrap';
import flatpickr from "flatpickr";

function createHTMLElement(type, id, arrayClasses, content) {
  const element = document.createElement(type);
  if (id) element.id = id;
  if (arrayClasses)
    arrayClasses.forEach((myClass) => element.classList.add(myClass));

  if (content) element.innerText = content;

  return element;
}

const content = document.getElementById("content");

flatpickr('.flatpickr.js-flatpickr-dateTime', {
  altInput: true,
  altFormat: "F j, Y",
  dateFormat: "Y-m-d",
});