let issuesData = [];

//1. data featch kora
async function fetchAll() {
    toggleLoader(true);
    try {
        const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
        const json = await res.json();
        issuesData = json.data || []; 
        render(issuesData);
    } catch (err) {
        console.error("Error fetching data:", err);
    } finally {
        toggleLoader(false);
    }
}

// 2. card render kora
function render(data) {
    const container = document.getElementById('issue-container');
    const countEl = document.getElementById('issueCount');
    if (countEl) countEl.innerText = data.length;
    
    container.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch";

    container.innerHTML = data.map(item => {
        const p = item.priority.toLowerCase();
        
        // color and icon set
        let pClass = "";
        let leftIconColor = "";
        let leftIcon = "";

        if (p === 'high') {
            pClass = 'text-[#EF4444] bg-[#FEECEC] border-[#FEECEC]';
            leftIconColor = "text-[#EF4444]";
            leftIcon = `<img src="assets/Open-Status.png" class="w-5 h-5 object-contain" alt="High">`;
        } else if (p === 'medium') {
            pClass = 'text-[#F59E0B] bg-[#FFF6D1] border-[#FFF6D1]';
            leftIconColor = "text-[#F59E0B]";
            leftIcon = `<img src="assets/Open-Status.png" class="w-5 h-5 object-contain" alt="High">`;
        } else {
            pClass = 'text-[#9CA3AF] bg-[#EEEFF2] border-[#EEEFF2]';
            leftIconColor = "text-[#9CA3AF]";
            leftIcon = `<img src="assets/Closed- Status .png" class="w-5 h-5 object-contain" alt="High">`;
        }

        return `
        <div onclick="openDetails('${item.id}')" class="card bg-[#ffff] border border-[#E4E4E7] rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full border-t-4 ${item.status === 'open' ? 'border-t-[#00A96E]' : 'border-t-[#A855F7]'}">
            <div class="p-6 flex-grow flex flex-col">
                <div class="flex justify-between items-center mb-5">
                    <span class="p-1.5 rounded-full ${p === 'medium' ? '' : ''} ${leftIconColor}">
                        ${leftIcon}
                    </span>
                    <span class="text-[9px] font-bold px-2.5 py-1 rounded-full border uppercase ${pClass}">${item.priority}</span>
                </div>

                <h3 class="font-bold text-[16px] text-[#1F2937] mb-2 min-h-[40px] leading-tight">${item.title}</h3>
                <p class="text-[#64748B] text-[12px] mb-6 line-clamp-2 min-h-[36px]">${item.description}</p>
                
                <div class="flex flex-row flex-wrap gap-2 mt-auto mb-2">
                    ${(item.labels || []).map(label => {
                        let lStyle = "bg-indigo-50 text-indigo-400 border-indigo-100";
                        if(label.toLowerCase().includes('bug')) lStyle = "bg-[#FEECEC] text-[#EF4444] border-[#FECACA]";
                        if(label.toLowerCase().includes('enhancement')) lStyle = "bg-[#FFF8DB] text-[#D97706] border-[#FDE68A]";
                        return `<span class="text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase whitespace-nowrap ${lStyle}">● ${label}</span>`;
                    }).join('')}
                </div>
            </div>

            <div class="mt-auto px-6 pb-6">
                <hr class="border-[#E4E4E7] mb-4 -mx-6">
                <div class="flex justify-between items-start text-[11px]">
                    <div class="space-y-1.5">
                        <p class="text-[#64748B]">#${item.id} by <span class="text-[#64748B] font-medium">${item.author}</span></p>
                        <p class="text-[#64748B]">Assignee: <span class="text-[#64748B] font-bold">${item.assignee || 'Unassigned'}</span></p>
                    </div>
                    <div class="text-right space-y-1.5">
                        <p class="text-[#64748B] font-bold">${new Date(item.createdAt).toLocaleDateString()}</p>
                        <p class="text-[#64748B]">Updated: ${new Date(item.updatedAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

// Details dekhano function
async function openDetails(id) {
    try {
        const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issue/" + id);
        const { data } = await res.json();
        
        const p = data.priority.toLowerCase();
        let pBg = p === 'high' ? 'bg-[#EF4444]' : (p === 'medium' ? 'bg-[#EF4444]' : 'bg-[#4A00FF]');

        document.getElementById('modal-data').innerHTML = `
            <h2 class="text-2xl font-bold text-[#1F2937] mb-3">${data.title}</h2>
            
            <div class="flex items-center gap-2 mb-4 text-[13px] text-[#64748B]">
                <span class="px-3 py-1 bg-[#00A96E] text-[#FFFF] font-bold rounded-full capitalize">Opened</span>
                <span>• Opened by ${data.author} • ${new Date(data.createdAt).toLocaleDateString()}</span>
            </div>

            <div class="flex flex-wrap gap-2 mb-6">
                ${(data.labels || []).map(label => {
                    let lStyle = label.toLowerCase().includes('bug') ? "bg-[#FEECEC] text-[#EF4444] border-[#FECACA]" : "bg-[#FFF8DB] text-[#D97706] border-[#FDE68A]";
                    return `<span class="text-[11px] font-bold px-3 py-1 rounded-lg border uppercase ${lStyle}">${label}</span>`;
                }).join('')}
            </div>

            <p class="text-[#64748B] text-[15px] leading-relaxed mb-8">${data.description}</p>
            
            <div class="grid grid-cols-2 gap-4 p-6 bg-[#F8FAFC] rounded-2xl mb-8 ">
                <div>
                    <p class="text-[12px] text-[#64748B] font-medium mb-1">Assignee:</p>
                    <p class="font-bold text-[#1F2937] text-lg">${data.assignee || 'Unassigned'}</p>
                </div>
                <div>
                    <p class="text-[12px] text-[#64748B] font-medium mb-1">Priority:</p>
                    <span class="px-4 py-1.5 ${pBg} text-white text-[11px] font-bold rounded-full uppercase inline-block shadow-sm">${data.priority}</span>
                </div>
            </div>

            <div class="flex justify-end">
                <button onclick="issue_modal.close()" class="bg-[#4A00FF] hover:bg-[#4338CA] text-white px-10 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95 text-sm uppercase tracking-wider">
                    Close
                </button>
            </div>
        `;
        issue_modal.showModal();
    } catch (err) { 
        console.error("Error loading issue:", err); 
    }
}

// ৪. সার্চ ও ফিল্টার লজিক
async function handleSearch() {
    const q = document.getElementById('searchInput').value;
    if(!q) return render(issuesData);
    toggleLoader(true);
    try {
        const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=" + q);
        const json = await res.json();
        render(json.data || []);
    } finally { toggleLoader(false); }
}

function changeTab(status, el) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active-tab'));
    el.classList.add('active-tab');
    if(status === 'all') render(issuesData);
    else render(issuesData.filter(i => i.status === status));
}

function toggleLoader(s) { 
    const loader = document.getElementById('loader');
    if(loader) loader.classList.toggle('hidden', !s); 
}

fetchAll();