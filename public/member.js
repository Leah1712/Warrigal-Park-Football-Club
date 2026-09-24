

const memberForm = document.getElementById('memberForm');

const message = document.getElementById('message');


memberForm.addEventListener('submit', async function(event) {

    // Stop the page from refreshing
    event.preventDefault();


    // Get the information entered by the registrar
    const name = document.getElementById('name').value;

    const date_of_birth =
        document.getElementById('date_of_birth').value;


    try {

        // Send the member information to the server
        const response = await fetch('/api/members', {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                name: name,
                date_of_birth: date_of_birth
            })

        });


        // Get the response from the server
        const data = await response.json();


        // If the member was successfully created
        if (response.ok) {

            message.textContent =
                'Member created successfully.';

            // Clear the form
            memberForm.reset();

        } else {

            // Display the error message
            message.textContent =
                data.message;

        }

    } catch (error) {

        console.error(error);

        message.textContent =
            'Unable to connect to the server.';

    }

});
