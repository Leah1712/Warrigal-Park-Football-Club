const memberForm = document.getElementById('memberForm');
const message = document.getElementById('message');

async function createMember(name, date_of_birth, confirmDuplicate = false) {
    try {
        const response = await fetch('/api/members', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ 
                name: name, 
                date_of_birth: date_of_birth, 
                confirmDuplicate: confirmDuplicate 
            })
        });

        // Parse JSON safely
        let data = {};
        try {
            data = await response.json();
        } catch (err) {
            console.error('Failed to parse JSON response:', err);
            data = { message: 'Unexpected response format from server.' };
        }

        // Handle 409 Conflict (Duplicate Member)
        if (response.status === 409 && data.isDuplicate) {
            const userConfirmed = confirm(data.message + '\n\nDo you want to create this member anyway?');

            if (userConfirmed) {
                // Retry with confirmation flag
                return await createMember(name, date_of_birth, true);
            } else {
                message.textContent = 'Member creation cancelled.';
                return;
            }
        }

        // Handle success/failure responses
        if (response.ok) {
            message.textContent = data.message || 'Member created successfully.';
            memberForm.reset();
        } else {
            message.textContent = data.message || 'Failed to create member.';
        }

    } catch (error) {
        console.error('Fetch error:', error);
        message.textContent = 'Unable to connect to the server.';
    }
}

memberForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const nameInput = document.getElementById('name');
    const dobInput = document.getElementById('date_of_birth');

    const name = nameInput ? nameInput.value.trim() : '';
    const date_of_birth = dobInput ? dobInput.value : '';

    if (!name || !date_of_birth) {
        message.textContent = 'Please fill in all required fields.';
        return;
    }

    createMember(name, date_of_birth);
});