const memberForm = document.getElementById('memberForm');

const message = document.getElementById('message');


// Sends the member data to the server. `confirm` is true when the
// registrar has already agreed to save a duplicate record anyway.
async function saveMember(name, date_of_birth, confirm = false) {

    return fetch('/api/members', {

        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            name: name,
            date_of_birth: date_of_birth,
            confirm: confirm
        })

    });

}


memberForm.addEventListener('submit', async function(event) {

    // Stop the page from refreshing
    event.preventDefault();


    // Get the information entered by the registrar
    const name = document.getElementById('name').value;

    const date_of_birth =
        document.getElementById('date_of_birth').value;


    try {

        // Scenario 1: Successful member creation
        let response = await saveMember(name, date_of_birth);

        let data = await response.json();


        // Scenario 2: Duplicate member handling
        // If the server flags a duplicate, ask the registrar to confirm or cancel
        if (response.status === 409 && data.duplicate) {

            const proceed = window.confirm(data.message);

            if (proceed) {

                // Registrar confirmed - save the record anyway
                response = await saveMember(name, date_of_birth, true);
                data = await response.json();

            } else {

                // Registrar cancelled - stop here
                message.textContent = 'Member creation cancelled.';
                return;

            }

        }


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


// Scenario 4: Update or deactivate member
// Call this from an "Edit" action, e.g. editMember(5, { name: 'New Name' })
async function editMember(memberId, updates) {

    try {

        const response = await fetch(`/api/members/${memberId}`, {

            method: 'PUT',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(updates)

        });

        const data = await response.json();

        if (response.ok) {

            message.textContent = 'Member updated successfully.';

        } else {

            message.textContent = data.message;

        }

        return response.ok;

    } catch (error) {

        console.error(error);

        message.textContent = 'Unable to connect to the server.';

        return false;

    }

}


// Convenience wrapper for marking a member inactive without deleting them
// e.g. deactivateMember(5)
function deactivateMember(memberId) {

    return editMember(memberId, { status: 'Inactive' });

}