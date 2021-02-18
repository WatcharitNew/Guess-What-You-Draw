import { createConsumer } from '@rails/actioncable';
const URL = process.env.REACT_APP_BACKEND_CABLE || 'ws://localhost:10000/cable';
const consumer = createConsumer(URL);
 
export default consumer;