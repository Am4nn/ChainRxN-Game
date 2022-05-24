class Queue {
    constructor() {
        let items = [];
        let front = 0;
        let rear = -1;
        let count = 0;

        //Add a new element in queue
        this.push = (elm) => {
            items[++rear] = elm;
            count++;
        };

        //Remove element from the queue
        this.pop = () => {
            let current = front++;
            let temp = items[current];
            items[current] = null;
            count--;
            return temp;
        };

        //Return the first element from the queue
        this.front = () => {
            return items[front];
        };

        //Return the last element from the queue
        this.back = () => {
            return items[rear];
        };

        //Check if queue is empty
        this.isEmpty = () => {
            return count === 0;
        };

        //Return the size of the queue
        this.size = () => {
            return count;
        };

        this.clear = () => {
            while (!this.isEmpty()) this.pop();
        }

        //Print the queue
        this.print = () => {
            let temp = items.filter((e) => e !== null);
            console.log(temp.toString());
        };

    }
}