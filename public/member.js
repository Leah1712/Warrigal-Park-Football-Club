async function updateMemberDetails(memberId) {
    const newName = prompt('Enter updated member name:');
    const newDob = prompt('Enter updated date of birth (YYYY-MM-DD):');

    if (!newName || !newDob) return;

    const response = await fetch(`/api/members/${memberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, date_of_birth: newDob })
    });

    const result = await response.json();
    alert(result.message);
}

// Function to deactivate member without deleting the record
async function deactivateMember(memberId) {
    const confirmDeactivate = confirm('Are you sure you want to mark this member as inactive?');
    if (!confirmDeactivate) return;

    const response = await fetch(`/api/members/${memberId}/deactivate`, {
        method: 'PATCH'
    });

    const result = await response.json();
    alert(result.message);
}
