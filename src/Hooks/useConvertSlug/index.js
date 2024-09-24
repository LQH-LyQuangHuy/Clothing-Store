
function useConvertSlug(String = '') {
    const convertSlug = String.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, m => m === 'đ' ? 'd' : 'D')
        .replace(/\s/g, "-")
    return (convertSlug);
}

export default useConvertSlug;