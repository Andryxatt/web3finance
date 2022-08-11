 import styled, { keyframes } from 'styled-components'
const blink = keyframes`
 0% {
   opacity: .2;
 }
 20% {
   opacity: 1;
 }
 100% {
   opacity: .2;
 }
`

export const  AnimatedDotsContainer = styled.div`
 display: contents;
 span {
  font-size: 1.5rem;
   font-family: 'dDin', 'Helvetica', sans-serif;
   animation: ${blink} 1.4s infinite both;
 }
 span:nth-child(2) {
   animation-delay: 0.2s;
 }
 span:nth-child(3) {
   animation-delay: 0.4s;
 }
`
const AnimatedDots = () => (
    <AnimatedDotsContainer>
      <span>.</span>
      <span>.</span>
      <span>.</span>
    </AnimatedDotsContainer>
  )
export default AnimatedDots;