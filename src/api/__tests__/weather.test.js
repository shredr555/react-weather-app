import { getCurrentWeather } from "../weather";

global.fetch = jest.fn();

describe('getCurrentWeather', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('fetches weather by city', async () => {
        const mockResponce = { weather: [{ description: 'ясно' }] };
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponce,
        });

        const result = await getCurrentWeather({ city: 'Moscow' });

        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('q=Moscow'));
        expect(result).toEqual(mockResponce);
    });

    test('fetches weather by coordinates', async () => {
        const mockResponce = { weather: [{ description: 'пасмурно' }] };
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponce,
        });

        const result = await getCurrentWeather({ lat: 55.75, lon: 37.62 });

        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('lat=55.75'));
        expect(result).toEqual(mockResponce);
    });

    test('throws error on missing params', async () => {
        await expect(getCurrentWeather({})).rejects.toThrow('Не указаны координаты');
    });

    test('handles API error gracefully', async () => {
        global.fetch = jest.fn(() => 
            Promise.resolve({
                ok: false,
                statusText: 'Not found',
                text: () => Promise.resolve('city not found'),
            })
        );

        await expect(getCurrentWeather({ city: 'FakeCity' }))
            .rejects
            .toThrow('Ошибка при получении погоды: city not found');
    });

    test('catches network error', async () => {
        global.fetch = jest.fn(() => 
            Promise.reject(new Error('Network error'))
        );

        await expect(getCurrentWeather({ city: 'Moscow' }))
            .rejects
            .toThrow('Network error');
    });
});