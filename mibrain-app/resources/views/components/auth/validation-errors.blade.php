@props(['class' => ''])

@if (isset($errors) && $errors->any())
    <div {{ $attributes->merge(['class' => trim('rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger ' . $class)]) }}>
        <div class="font-semibold">Please fix the following:</div>
        <ul class="mt-2 space-y-1">
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif