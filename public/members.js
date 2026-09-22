const memberForm = document.getElementById('memberForm');
const message = document.getElementById('message');

async function createMember(name, date_of_birth, confirmDuplicate = false) {
    try {
        const response = await fetch('/api/members', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, date_of_birth, confirmDuplicate })
        });

        const data = await response.json();

        // If duplicate detected, prompt registrar to confirm or cancel
        if (response.status === 409 && data.isDuplicate) {
            const userConfirmed = confirm(`${data.message}\n\nDo you want to create this member anyway?`);

            if (userConfirmed) {
                // Retry with confirmation flag set to true
                return await createMember(name, date_of_birth, true);
            } else {
                message.textContent = 'Member creation cancelled.';
                return;
            }
        }

        if (response.ok) {
            message.textContent = 'Member created successfully.';
            memberForm.reset();
        } else {
            message.textContent = data.message;
        }

    } catch (error) {
        console.error(error);
        message.textContent = 'Unable to connect to the server.';
    }
}

memberForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const date_of_birth = document.getElementById('date_of_birth').value;

    createMember(name, date_of_birth);
});


