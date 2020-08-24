let canvas = document.getElementsByTagName("canvas")[0];
let storeinput = document.getElementById("storecount");

//Initialize a canvas based on the current window size
canvas.height = window.innerHeight-200;
canvas.width = window.innerWidth;
let context = canvas.getContext("2d");

let clicks = 0;
let k = 1;

let XX = [];
let YY = [];

canvas.addEventListener("click", onMouseClick);
canvas.addEventListener("keypress", onMouseClick);
storeinput.addEventListener("change", updateApp);

function onMouseClick(e){

        placeHome(e.clientX,e.clientY);

        if (clicks>0){
        XX.push(e.clientX);
        YY.push(e.clientY);
        }
        clicks++;

        updateApp();

}

//Function to run the k-means algorithm with any new changes added (new homes or different store number)
function updateApp(){

        k=storeinput.value;

        k=parseInt(k, 10);

        updateCanvas(k);
}


function kmeans(XX,YY,K) {

        let randomX;
        let randomY;
        let centroidsX=[];
        let centroidsY=[];
        let labels = new Array(XX.length).fill(0);
        let previouslabels = new Array(XX.length).fill(1); //This will serve as the labels from the previous iteration. It is used to check if the algorithm has converged.
        let converged = false;

        //Generate Random Centroids in the area of the current points
        let validcentroids = false;
        let uniquelabels;

        while (validcentroids === false){

                centroidsX=[];
                centroidsY=[];

                for (let i=0;i<K;i++){
                        randomX = Math.random() * (Math.max(...XX)-Math.min(...XX)) + Math.min(...XX);
                        randomY = Math.random() * (Math.max(...YY)-Math.min(...YY)) + Math.min(...YY);
                        centroidsX.push(randomX);
                        centroidsY.push(randomY);
                }

                uniquelabels = Array.from(new Set(getLabels(XX,YY,centroidsX,centroidsY)));

                //Make sure that every centroid belongs to at least one point, otherwise the algorithm fails
                if (uniquelabels.length === K){
                        validcentroids = true;
                }
        }

        while (converged === false){

                labels = getLabels(XX,YY,centroidsX,centroidsY);

                //If the previous labels
                if (arrayEquals(labels,previouslabels)){
                        converged = true;
                }

                previouslabels=labels;

                let pointcount = new Array(K).fill(0);
                let pointsumX = new Array(K).fill(0);
                let pointsumY = new Array(K).fill(0);

                for (let i=0;i<labels.length;i++){ //get sums of x and y coordinates associated with each centroid to update its location.
                        pointcount[labels[i]]++;
                        pointsumX[labels[i]]+=XX[i];
                        pointsumY[labels[i]]+=YY[i];
                }
                
                //compute new centroid location using the average of all points associated with it
                for (let i=0;i<K;i++){
                        centroidsX[i]=pointsumX[i]/pointcount[i];
                        centroidsY[i]=pointsumY[i]/pointcount[i];
                }
        }
        return [centroidsX,centroidsY];
}

function distance(x1,y1,x2,y2){
        return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}

function getLabels(XX,YY,CX,CY){
        label = new Array(XX.length).fill(0);
        for (let i=0;i<XX.length;i++){ //iterate over each point
                let distances = [];
                for (let j=0;j<CX.length;j++){ //iterate over each centroid, finding distance to the given point
                        distances.push(distance(XX[i],YY[i],CX[j],CY[j]));
                }
                label[i]=(distances.indexOf(Math.min(...distances))); //creating a list of labels that corresponds to each point
        }
        return label
}

function arrayEquals(a, b) {
        return Array.isArray(a) &&
          Array.isArray(b) &&
          a.length === b.length &&
          a.every((val, index) => val === b[index]);
      }

function placeStore(x,y){
        context.beginPath();
        context.lineWidth = 2;
        context.strokeRect(x, y, 70, 30);
        context.strokeStyle = "#FF0000";
        context.lineWidth = 2;
        context.fillRect(x+30, y+20, 10, 10);
        context.fillStyle = "#FF0000";
        context.stroke();
        context.closePath()
}

function placeHome(x,y){
        context.lineWidth = 2;
        context.strokeRect(x, y, 30, 18);
        context.strokeStyle = "#fff";
        context.fillRect(x+12, y+10, 6, 8);
        context.fillStyle = "#fff";
        context.stroke();
        context.beginPath();
        context.moveTo(x,y);
        context.lineTo(x+30,y);
        context.lineTo(x+15,y-10);
        context.lineTo(x,y);
        context.closePath()

}

function updateCanvas(K){

        context.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i=0;i<XX.length;i++){
                placeHome(XX[i],YY[i]);
                
        }

        if (XX.length>=K){

                context.clearRect(0, 0, canvas.width, canvas.height);

                for (let i=0;i<XX.length;i++){
                        placeHome(XX[i],YY[i]);
                }

                let xs=[];
                let ys=[];
                [xs,ys]=kmeans(XX,YY,K);
                for (let i=0;i<xs.length;i++){
                        placeStore(xs[i],ys[i]);
                        placeStore(xs[i],ys[i]);
                }
        }
}