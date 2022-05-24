const addSphere = (colorOfSphere, node, big = false) => {

    const sphere = document.createElement('div');
    const sec = document.createElement('section');
    const fig = document.createElement('figure');

    let x = '';
    if (big) {
        x = '2';
    }

    sphere.classList.add(`sphere${x}`);
    sec.classList.add(`stageOfSphere${x}`);
    fig.classList.add(`ballOfSphere${x}`, colorOfSphere);

    sec.appendChild(fig);
    sphere.appendChild(sec);

    node.appendChild(sphere);
}