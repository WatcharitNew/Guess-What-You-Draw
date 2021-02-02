import { createConsumer } from '@rails/actioncable';
const URL = 'ws://localhost:10000/cable';
const consumer = createConsumer(URL);
 
export default consumer;