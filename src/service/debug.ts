const debugDiv = document.createElement('div');

document.body.appendChild(debugDiv);

function setInfo(id: string, info: string) {
    var infoContainer = document.getElementById(`debug-${id}`);
    if (!infoContainer) {
        infoContainer = document.createElement('p');
        infoContainer.id = `debug-${id}`;
        debugDiv.appendChild(infoContainer);
    }
    infoContainer.innerText = `${id}: ${info}`;
}

export {
    setInfo
};