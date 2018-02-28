export function scrollIntoView(element) {
  if (element.getBoundingClientRect().top < 0) {
    element.scrollIntoView({block: 'start', behavior: 'smooth'})
  }
}
